import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type {
    Gear,
    GearWithQuantity,
    Trip,
    TripShare,
} from '../../types/types';
import _ from 'lodash';

export const publishTrip = async (tripId: string) => {
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
            // remove private note from gear
            delete acc[gearId].privateNote;
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
    const baseWeight = _.round(
        _.sumBy(_.values(tripShareGears), (gear) => {
            return gear.weight * (gear?.quantity || 1) || 0;
        }),
    );
    const consumablesWeight = _.round(
        _.sumBy(
            _.values(trip.consumables),
            (consumable) =>
                +consumable.weight * (consumable?.quantity || 1) || 0,
        ),
    );
    const packWeight = _.round(baseWeight + consumablesWeight);
    const wornWeight = _.round(
        _.sumBy(_.values(tripShareWornGears), (gear) => {
            return gear.weight * (gear?.quantity || 1) || 0;
        }),
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

    // get owner's locale from userMeta
    const userMetaDoc = await admin
        .firestore()
        .collection('userMeta')
        .doc(ownerUid)
        .get();
    const userMetaData = userMetaDoc.data();
    if (userMetaData?.locale) {
        tripShare.locale = userMetaData.locale;
    }

    // write trip share data to firestore in tripShare collection
    const tripShareCollectionRef = admin.firestore().collection('tripShare');
    const tripShareDocRef = tripShareCollectionRef.doc(tripId);
    await tripShareDocRef.set(
        {
            ...tripShare,
            tripShareCreated: FieldValue.serverTimestamp(),
        },
        {
            merge: true,
        },
    );
};

export const unpublishTrip = async (tripId: string) => {
    // delete trip share data from firestore
    const tripShareCollectionRef = admin.firestore().collection('tripShare');
    const tripShareDocRef = tripShareCollectionRef.doc(tripId);
    await tripShareDocRef.delete();
};
