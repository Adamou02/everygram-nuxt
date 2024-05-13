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
import { FieldPath } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import type { Gear, GearWithQuantity, Trip, TripShare } from '../types/types';
import { setGlobalOptions } from 'firebase-functions/v2';

// Set the maximum instances to 10 for all functions
// To fix Error: Error generating the service identity for eventarc.googleapis.com.
setGlobalOptions({
    maxInstances: 10,
    region: 'asia-northeast1',
    timeoutSeconds: 60,
});

admin.initializeApp();

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

export const onGearWrittenUpdateTripShare = onDocumentWritten(
    'gear/{gearId}',
    async (event) => {
        const gearId = event.params.gearId;
        const gear = event.data?.after.data();

        if (!gear) {
            return null;
        }

        const tripSharesSnapshot = await admin
            .firestore()
            .collection('tripShare')
            .where(`gears.${gearId}`, '!=', false)
            .get();

        const allUpdates = tripSharesSnapshot.docs.map(async (doc) => {
            const tripShare = doc.data() as TripShare;
            const gearWithQuantity = tripShare.gears[gearId];
            if (!gearWithQuantity) {
                return;
            }
            const newGearWithQuantity: GearWithQuantity = {
                ...gearWithQuantity,
                ...gear,
            };
            tripShare.gears[gearId] = newGearWithQuantity;
            return await doc.ref.set(tripShare);
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
    const gearIds = Object.keys(trip.gears);
    const gears: Gear[] = [];

    if (gearIds.length) {
        // read gears data by gearIds from firestore
        const gearsSnapshot = await admin
            .firestore()
            .collection('gear')
            .where(FieldPath.documentId(), 'in', gearIds)
            .get();
        gearsSnapshot.docs.forEach((doc) => {
            gears.push({
                id: doc.id,
                ...doc.data(),
            } as Gear);
        });
    }

    // map gears into array of GearWithQuantity
    const gearsWithQuantity: GearWithQuantity[] = gears.map((gear) => ({
        ...gear,
        quantity: trip.gears[gear.id].quantity,
    }));

    // build trip share data
    const tripShare: TripShare = {
        ...trip,
        gears: gearsWithQuantity.reduce(
            (acc, gear) => ({ ...acc, [gear.id]: gear }),
            {},
        ),
        owner: {
            displayName: owner.displayName || '',
            photoURL: owner.photoURL || '',
        },
    };

    // write trip share data to firestore in tripShare collection
    const tripShareCollectionRef = admin.firestore().collection('tripShare');
    const tripShareDocRef = tripShareCollectionRef.doc(tripId);
    await tripShareDocRef.set(tripShare);
};

const unpublishTrip = async (tripId: string) => {
    // delete trip share data from firestore
    const tripShareCollectionRef = admin.firestore().collection('tripShare');
    const tripShareDocRef = tripShareCollectionRef.doc(tripId);
    await tripShareDocRef.delete();
};
