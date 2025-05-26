import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import type { Trip } from '../types/types';
import _ from 'lodash';

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
