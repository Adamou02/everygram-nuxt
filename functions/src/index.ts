import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import {
    onDocumentDeleted,
    onDocumentUpdated,
} from 'firebase-functions/v2/firestore';
import type { Gear, GearWithQuantity, Trip, TripShare } from '../types/types';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as _ from 'lodash';

// Set the maximum instances to 10 for all functions
// To fix Error: Error generating the service identity for eventarc.googleapis.com.
setGlobalOptions({
    maxInstances: 10,
    region: 'asia-northeast1',
    timeoutSeconds: 60,
});

admin.initializeApp();

const publishTrip = async (tripId: string) => {
    // get trip data from firestore
    const tripDocRef = admin.firestore().collection('trip').doc(tripId);
    const tripDoc = await tripDocRef.get();
    if (!tripDoc.exists) {
        logger.error('Trip does not exist.');
        return;
    }
    const trip = tripDoc.data() as Trip;

    // get owner user Uid
    const ownerUid = Object.entries(trip.role).find(
        ([uid, role]) => role === 'owner',
    )?.[0];
    if (!ownerUid) {
        logger.error('Owner not found.');
        return;
    }

    // get owner user data
    const owner = await admin.auth().getUser(ownerUid);
    if (!owner) {
        logger.error('Owner not found.');
        return;
    }

    // get owner's user gears
    const ownerGearsSnapshot = await admin
        .firestore()
        .collection('userGears')
        .doc(ownerUid)
        .get();
    const userGearsData = ownerGearsSnapshot.data();
    if (!userGearsData) {
        logger.error('Owner gears not found.');
        return;
    }
    const gearMap = userGearsData.gears as Record<string, Gear>;

    // combine user's gears with trip's gears and worn gears = gears with quantity
    const tripShareGears: Record<string, GearWithQuantity> = Object.entries(
        trip.gears,
    ).reduce(
        (acc, [gearId, tripGear]) => {
            if (!gearMap[gearId]) {
                return acc;
            }
            acc[gearId] = {
                ...gearMap[gearId],
                quantity: tripGear.quantity,
            };
            return acc;
        },
        {} as Record<string, GearWithQuantity>,
    );
    const tripShareWornGears: Record<string, GearWithQuantity> = Object.entries(
        trip.wornGears,
    ).reduce(
        (acc, [gearId, tripGear]) => {
            if (!gearMap[gearId]) {
                return acc;
            }
            acc[gearId] = {
                ...gearMap[gearId],
                quantity: tripGear.quantity,
            };
            return acc;
        },
        {} as Record<string, GearWithQuantity>,
    );

    // calculate weights
    const baseWeight = Object.values(tripShareGears).reduce(
        (acc, gear) => acc + gear.weight * gear.quantity,
        0,
    );
    const consumablesWeight = _.sumBy(
        _.values(trip.consumables),
        (consumable) => +consumable.weight || 0,
    );
    const packWeight = baseWeight + consumablesWeight;
    const wornWeight = Object.values(tripShareWornGears).reduce(
        (acc, gear) => acc + gear.weight * gear.quantity,
        0,
    );

    // build trip share data
    const tripShare: TripShare = {
        ...trip,
        gears: tripShareGears,
        wornGears: tripShareWornGears,
        owner: {
            displayName: owner.displayName || '',
            photoURL: owner.photoURL || '',
        },
        baseWeight,
        consumablesWeight,
        packWeight,
        wornWeight,
    };

    // write trip share data to firestore in tripShare collection
    const tripShareCollectionRef = admin.firestore().collection('tripShare');
    const tripShareDocRef = tripShareCollectionRef.doc(tripId);
    await tripShareDocRef.set({
        ...tripShare,
        tripShareCreated: FieldValue.serverTimestamp(),
    });
};

const unpublishTrip = async (tripId: string) => {
    // delete trip share data from firestore
    const tripShareCollectionRef = admin.firestore().collection('tripShare');
    const tripShareDocRef = tripShareCollectionRef.doc(tripId);
    await tripShareDocRef.delete();
};

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

        // 2. when gear photo is updated, delete the old photo by old photo file name
        const deleteOldPhotoPromise = (async () => {
            const newPhotoFileName = newGear?.photo?.fileName;
            const oldPhotoFileName = oldGear?.photo?.fileName;
            if (newPhotoFileName !== oldPhotoFileName) {
                if (oldPhotoFileName) {
                    const oldFilePath = `gear/${gearId}/${oldPhotoFileName}`;
                    await admin.storage().bucket().file(oldFilePath).delete();
                }
            }
        })();

        return Promise.all([
            publishTripShareAgainPromise,
            deleteOldPhotoPromise,
        ]);
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

        // 2. when trip banner image is updated, delete the old image by old banner image file name
        const deleteOldBannerImagePromise = (async () => {
            if (
                newTrip?.bannerImage?.fileName !==
                oldTrip?.bannerImage?.fileName
            ) {
                if (oldTrip?.bannerImage?.fileName) {
                    const oldFileName = oldTrip.bannerImage.fileName;
                    const oldFilePath = `trip/${tripId}/${oldFileName}`;
                    await admin.storage().bucket().file(oldFilePath).delete();
                }
            }
        })();

        return Promise.all([
            updateTripSharePromise,
            deleteOldBannerImagePromise,
        ]);
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
