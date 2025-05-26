import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ProfileData } from '../../types/types';

// Callable function when user profile is updated
export const onUserProfileUpdated = functions
    .region('asia-northeast1')
    .https.onCall(
        async (data: Partial<ProfileData> & { userId: string }, context) => {
            const { userId, displayName, photoURL } = data || {};
            if (!userId || typeof userId !== 'string') {
                throw new functions.https.HttpsError(
                    'invalid-argument',
                    'userId is required and must be a string',
                );
            }
            if (!displayName && !photoURL) {
                throw new functions.https.HttpsError(
                    'invalid-argument',
                    'At least displayName or photoURL must be provided',
                );
            }

            // Update tripShare owner info
            const tripSharesSnapshot = await admin
                .firestore()
                .collection('tripShare')
                .where(`role.${userId}`, '==', 'owner')
                .get();

            // Create a batch to update all matching tripShare documents
            if (!tripSharesSnapshot.empty) {
                const batch = admin.firestore().batch();
                const updateData: any = {};
                if (displayName) updateData['owner.displayName'] = displayName;
                if (photoURL) updateData['owner.photoURL'] = photoURL;
                tripSharesSnapshot.forEach((doc) =>
                    batch.update(doc.ref, updateData),
                );
                await batch.commit();
            }

            return { tripShareUpdated: tripSharesSnapshot.size };
        },
    );
