import * as functions from 'firebase-functions';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Callable function to increment viewCount of a trip
export const incrementTripShareView = functions
    .region('asia-northeast1')
    .https.onCall(async (data, context) => {
        const tripId = data?.tripId;
        if (!tripId || typeof tripId !== 'string') {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'tripId is required and must be a string',
            );
        }

        try {
            const db = getFirestore();
            await db
                .collection('tripMeta')
                .doc(tripId)
                .set(
                    {
                        tripId,
                        viewCount: FieldValue.increment(1),
                    },
                    {
                        merge: true, // Use merge to avoid overwriting other fields
                    },
                );

            return { success: true };
        } catch (error: any) {
            throw new functions.https.HttpsError(
                'not-found',
                'Trip not found or update failed',
                error.message,
            );
        }
    });
