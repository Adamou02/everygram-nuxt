import * as functions from 'firebase-functions';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Callable function to increment viewCount of a tripShare document by id
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

        const db = getFirestore();
        const tripRef = db.collection('tripShare').doc(tripId);

        try {
            await tripRef.update({
                viewCount: FieldValue.increment(1),
            });

            return { success: true };
        } catch (error: any) {
            throw new functions.https.HttpsError(
                'not-found',
                'TripShare not found or update failed',
                error.message,
            );
        }
    });
