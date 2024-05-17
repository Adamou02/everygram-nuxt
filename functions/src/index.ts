/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import {
    onDocumentDeleted,
    onDocumentWritten,
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

// update trip share when trip is written
export const onTripWrittenUpdateTripShare = onDocumentWritten(
    'trip/{tripId}',
    (event) => {
        const tripId = event.params.tripId;
        const newTrip = event.data?.after.data();
        const oldTrip = event.data?.before.data();

        if (newTrip?.isPublished) {
            return publishTrip(tripId);
        }
        if (oldTrip?.isPublished && !newTrip?.isPublished) {
            return unpublishTrip(tripId);
        }
        return null;
    },
);

// unpublish trip share when trip is deleted
export const onTripDeletedUnpublishTrip = onDocumentDeleted(
    'trip/{tripId}',
    (event) => {
        const tripId = event.params.tripId;
        return unpublishTrip(tripId);
    },
);

// update trip share when gear is written
export const onGearWrittenUpdateTripShare = onDocumentWritten(
    'gear/{gearId}',
    async (event) => {
        const gearId = event.params.gearId;
        const gear = event.data?.after.data();

        if (!gear) {
            return null;
        }

        // get trip shares that have the gear
        const tripSharesWithGearSnapshot = await admin
            .firestore()
            .collection('tripShare')
            .where(`gears.${gearId}`, '!=', false)
            .get();

        // get trip shares that have the worn gear
        const tripSharesWithWornGearSnapshot = await admin
            .firestore()
            .collection('tripShare')
            .where(`wornGears.${gearId}`, '!=', false)
            .get();

        // merge trip shares with gear and worn gear
        const tripShareDocs = _.uniqBy(
            [
                ...tripSharesWithGearSnapshot.docs,
                ...tripSharesWithWornGearSnapshot.docs,
            ],
            'id',
        );

        const allUpdates = tripShareDocs.map(async (doc) => {
            const tripShare = doc.data() as TripShare;

            // update gear in trip share
            const gearWithQuantity = tripShare.gears[gearId];
            if (gearWithQuantity) {
                const newGearWithQuantity: GearWithQuantity = {
                    ...gearWithQuantity,
                    ...gear,
                };
                tripShare.gears[gearId] = newGearWithQuantity;
            }

            // update worn gear in trip share
            const wornGearWithQuantity = tripShare.wornGears[gearId];
            if (wornGearWithQuantity) {
                const newWornGearWithQuantity: GearWithQuantity = {
                    ...wornGearWithQuantity,
                    ...gear,
                };
                tripShare.wornGears[gearId] = newWornGearWithQuantity;
            }

            return await doc.ref.update({
                ...tripShare,
                updated: FieldValue.serverTimestamp(),
            });
        });

        return Promise.all(allUpdates);
    },
);

// update trip when gear is deleted (and then trip share will be updated automatically)
export const onGearDeletedUpdateTrip = onDocumentDeleted(
    'gear/{gearId}',
    async (event) => {
        const gearId = event.params.gearId;

        // get trips that have the gear
        const tripsWithGearSnapshot = await admin
            .firestore()
            .collection('trip')
            .where(`gears.${gearId}`, '!=', false)
            .get();

        // get trips that have the worn gear
        const tripsWithWornGearSnapshot = await admin
            .firestore()
            .collection('trip')
            .where(`wornGears.${gearId}`, '!=', false)
            .get();

        // merge trips with gear and worn gear
        const tripsSnapshot = _.uniqBy(
            [...tripsWithGearSnapshot.docs, ...tripsWithWornGearSnapshot.docs],
            'id',
        );

        const allUpdates = tripsSnapshot.map(async (doc) => {
            const trip = doc.data() as Trip;

            // delete gear from trip
            delete trip.gears[gearId];

            // delete worn gear from trip
            delete trip.wornGears[gearId];

            return await doc.ref.update({
                ...trip,
                updated: FieldValue.serverTimestamp(),
            });
        });

        return Promise.all(allUpdates);
    },
);

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

    // get all gear Id from trip
    const gearIds = _.uniq([
        ...Object.keys(trip.gears),
        ...Object.keys(trip.wornGears),
    ]);
    const gearMap: Record<string, Gear> = {};

    if (gearIds.length) {
        // read gears data by gearIds from firestore
        const gearsSnapshot = await admin
            .firestore()
            .collection('gear')
            .where(FieldPath.documentId(), 'in', gearIds)
            .get();
        gearsSnapshot.docs.forEach((doc) => {
            gearMap[doc.id] = {
                id: doc.id,
                ...doc.data(),
            } as Gear;
        });
    }

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

    // build trip share data
    const tripShare: TripShare = {
        ...trip,
        gears: tripShareGears,
        wornGears: tripShareWornGears,
        owner: {
            displayName: owner.displayName || '',
            photoURL: owner.photoURL || '',
        },
    };

    // write trip share data to firestore in tripShare collection
    const tripShareCollectionRef = admin.firestore().collection('tripShare');
    const tripShareDocRef = tripShareCollectionRef.doc(tripId);
    await tripShareDocRef.set({
        ...tripShare,
        created: FieldValue.serverTimestamp(),
    });
};

const unpublishTrip = async (tripId: string) => {
    // delete trip share data from firestore
    const tripShareCollectionRef = admin.firestore().collection('tripShare');
    const tripShareDocRef = tripShareCollectionRef.doc(tripId);
    await tripShareDocRef.delete();
};

// when trip banner image is updated, delete the old image by old banner image file name
export const onTripBannerImageUpdatedDeleteOldImage = onDocumentWritten(
    'trip/{tripId}',
    async (event) => {
        const tripId = event.params.tripId;
        const newTrip = event.data?.after.data();
        const oldTrip = event.data?.before.data();

        if (!newTrip || !oldTrip) {
            return null;
        }

        if (newTrip.bannerImage?.fileName === oldTrip.bannerImage?.fileName) {
            return null;
        }

        if (oldTrip.bannerImage?.fileName) {
            const oldFileName = oldTrip.bannerImage.fileName;
            const oldFilePath = `trip/${tripId}/${oldFileName}`;
            await admin.storage().bucket().file(oldFilePath).delete();
        }

        return null;
    },
);

// when trip is deleted, delete the storage path trip/{tripId}
export const onTripDeletedDeleteTripStorage = onDocumentDeleted(
    'trip/{tripId}',
    async (event) => {
        const tripId = event.params.tripId;
        const filePath = `trip/${tripId}`;
        await admin.storage().bucket().deleteFiles({
            prefix: filePath,
        });
    },
);
