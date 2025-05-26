import * as admin from 'firebase-admin';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import _ from 'lodash';
import { publishTrip } from './trip-publish-unpublish';
import {
    generateThumbnails,
    GEAR_THUMBNAIL_SIZES,
} from './generate-thumbnails';

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
