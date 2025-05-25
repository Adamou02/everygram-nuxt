import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import {
    onDocumentDeleted,
    onDocumentUpdated,
} from 'firebase-functions/v2/firestore';
import type { Trip } from '../types/types';
import { setGlobalOptions } from 'firebase-functions/v2';
import _ from 'lodash';
import serviceAccount from './everygram-firebase-adminsdk.json';

import { publishTrip, unpublishTrip } from './trip-publish-unpublish';
import {
    generateThumbnails,
    GEAR_THUMBNAIL_SIZES,
    TRIP_THUMBNAIL_SIZES,
} from './generate-thumbnails';

// Set the maximum instances to 10 for all functions
// To fix Error: Error generating the service identity for eventarc.googleapis.com.
setGlobalOptions({
    maxInstances: 10,
    region: 'asia-northeast1',
    timeoutSeconds: 60,
});

// set credential for admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: 'everygram.appspot.com',
});

export const onGearUpdated = onDocumentUpdated(
    'gear/{gearId}',
    async (event) => {
        const gearId = event.params.gearId;
        const newGear = event.data?.after.data();
        const oldGear = event.data?.before.data();

        // 1. publish trips again share when gear is updated (to calculate weights again)
        const publishTripShareAgainPromise = (async () => {
            // get trip shares that have the gear or worn gear
            const [tripSharesWithGearSnapshot, tripSharesWithWornGearSnapshot] =
                await Promise.all([
                    // get trip shares that have the gear
                    admin
                        .firestore()
                        .collection('tripShare')
                        .where(`gears.${gearId}`, '!=', false)
                        .get(),
                    // get trip shares that have the worn gear
                    admin
                        .firestore()
                        .collection('tripShare')
                        .where(`wornGears.${gearId}`, '!=', false)
                        .get(),
                ]);

            // merge trip shares with gear and worn gear
            const tripShareDocs = _.uniqBy(
                [
                    ...tripSharesWithGearSnapshot.docs,
                    ...tripSharesWithWornGearSnapshot.docs,
                ],
                'id',
            );

            // publish trip share again
            const allPublishes = tripShareDocs.map(async (doc) =>
                publishTrip(doc.id),
            );

            return Promise.all(allPublishes);
        })();

        // 2. when gear photo is updated
        const updatePhotoPromise = (async () => {
            const subPromises = [];
            const newPhotoFileName = newGear?.photo?.fileName;
            const oldPhotoFileName = oldGear?.photo?.fileName;

            if (newPhotoFileName === oldPhotoFileName) {
                return;
            }

            // 2.1. delete the old photo and thumbnails
            if (oldPhotoFileName) {
                const oldPhotoPath = `gear/${gearId}/${oldPhotoFileName}`;
                subPromises.push(
                    admin.storage().bucket().deleteFiles({
                        prefix: oldPhotoPath,
                    }),
                );
            }

            // 2.2. generate new thumbnails and save to gear
            if (newPhotoFileName) {
                subPromises.push(
                    (async () => {
                        // 2.2.1. generate thumbnails
                        const generatedThumbnails = await generateThumbnails({
                            imagePath: `gear/${gearId}/${newPhotoFileName}`,
                            targetPath: `gear/${gearId}/${newPhotoFileName}`,
                            sizes: GEAR_THUMBNAIL_SIZES,
                        });
                        if (!generatedThumbnails) {
                            return;
                        }

                        // 2.2.2. use transaction to update gear with thumbnails and userGears with thumbnails
                        await admin
                            .firestore()
                            .runTransaction(async (transaction) => {
                                // Get references to the documents
                                const gearDocRef = admin
                                    .firestore()
                                    .collection('gear')
                                    .doc(gearId);
                                const userGearsDocRef = admin
                                    .firestore()
                                    .collection('userGears')
                                    .doc(Object.entries(newGear.role)[0][0]);
                                // Read the documents
                                const [gearDoc, userGearsDoc] =
                                    await Promise.all([
                                        transaction.get(gearDocRef),
                                        transaction.get(userGearsDocRef),
                                    ]);
                                if (!gearDoc.exists || !userGearsDoc.exists) {
                                    return;
                                }
                                // Perform the updates
                                transaction.update(gearDocRef, {
                                    'photo.thumbnails': generatedThumbnails,
                                });
                                transaction.update(userGearsDocRef, {
                                    [`gears.${gearId}.photo.thumbnails`]:
                                        generatedThumbnails,
                                });
                            });
                    })(),
                );
            }
            return Promise.all(subPromises);
        })();

        return Promise.all([publishTripShareAgainPromise, updatePhotoPromise]);
    },
);

export const onGearDeleted = onDocumentDeleted(
    'gear/{gearId}',
    async (event) => {
        const gearId = event.params.gearId;

        // 1. delete the storage path gear/{gearId}
        const deleteStoragePromise = (async () => {
            const filePath = `gear/${gearId}`;
            await admin.storage().bucket().deleteFiles({
                prefix: filePath,
            });
        })();

        // 2. update trips when gear is deleted (and then trip share will be updated automatically)
        const updateTripsPromise = (async () => {
            // get trips that have the gear or worn gear
            const [tripsWithGearSnapshot, tripsWithWornGearSnapshot] =
                await Promise.all([
                    // get trips that have the gear
                    admin
                        .firestore()
                        .collection('trip')
                        .where(`gears.${gearId}`, '!=', false)
                        .get(),
                    // get trips that have the worn gear
                    admin
                        .firestore()
                        .collection('trip')
                        .where(`wornGears.${gearId}`, '!=', false)
                        .get(),
                ]);

            // merge trips with gear and worn gear
            const tripsSnapshot = _.uniqBy(
                [
                    ...tripsWithGearSnapshot.docs,
                    ...tripsWithWornGearSnapshot.docs,
                ],
                'id',
            );

            const allUpdates = tripsSnapshot.map(async (doc) => {
                const trip = doc.data() as Trip;

                // delete gear from trip
                delete trip.gears[gearId];

                // delete worn gear from trip
                delete trip.wornGears[gearId];

                await doc.ref.update({
                    ...trip,
                    updated: FieldValue.serverTimestamp(),
                });
            });

            return Promise.all(allUpdates);
        })();

        return Promise.all([deleteStoragePromise, updateTripsPromise]);
    },
);

export const onTripUpdated = onDocumentUpdated(
    'trip/{tripId}',
    async (event) => {
        const tripId = event.params.tripId;
        const newTrip = event.data?.after.data();
        const oldTrip = event.data?.before.data();

        // 1. update trip share when trip is updated
        const updateTripSharePromise = (async () => {
            if (newTrip?.isPublished) {
                // publish or re-publish trip share if trip is published
                await publishTrip(tripId);
                return;
            }
            if (oldTrip?.isPublished && !newTrip?.isPublished) {
                // unpublish trip share if trip is unpublished
                await unpublishTrip(tripId);
                return;
            }
        })();

        // 2. when trip banner image is updated
        const updateBannerImagePromise = (async () => {
            const subPromises = [];
            const newBannerImageFileName = newTrip?.bannerImage?.fileName;
            const oldBannerImageFileName = oldTrip?.bannerImage?.fileName;

            if (newBannerImageFileName === oldBannerImageFileName) {
                return;
            }

            // 2.1. delete the old banner image and thumbnails
            if (oldBannerImageFileName) {
                const oldBannerImagePath = `trip/${tripId}/${oldBannerImageFileName}`;
                subPromises.push(
                    admin.storage().bucket().deleteFiles({
                        prefix: oldBannerImagePath,
                    }),
                );
            }

            // 2.2. generate new thumbnails and save to trip
            if (newBannerImageFileName) {
                subPromises.push(
                    (async () => {
                        // 2.2.1. generate thumbnails
                        const generatedThumbnails = await generateThumbnails({
                            imagePath: `trip/${tripId}/${newBannerImageFileName}`,
                            targetPath: `trip/${tripId}/${newBannerImageFileName}`,
                            sizes: TRIP_THUMBNAIL_SIZES,
                        });
                        if (!generatedThumbnails) {
                            return;
                        }

                        // 2.2.2. update trip with thumbnails
                        await admin
                            .firestore()
                            .collection('trip')
                            .doc(tripId)
                            .update({
                                'bannerImage.thumbnails': generatedThumbnails,
                            });
                    })(),
                );
            }

            await Promise.all(subPromises);
        })();

        return Promise.all([updateTripSharePromise, updateBannerImagePromise]);
    },
);

export const onTripDeleted = onDocumentDeleted(
    'trip/{tripId}',
    async (event) => {
        const tripId = event.params.tripId;

        // 1. delete the storage path trip/{tripId}
        const deleteStoragePromise = (async () => {
            const filePath = `trip/${tripId}`;
            await admin.storage().bucket().deleteFiles({
                prefix: filePath,
            });
        })();

        // 2. unpublish trip share when trip is deleted
        const unpublishTripPromise = unpublishTrip(tripId);

        return Promise.all([deleteStoragePromise, unpublishTripPromise]);
    },
);

export { incrementTripShareView } from './increment-tripshare-view';
