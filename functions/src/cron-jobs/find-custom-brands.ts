import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Scheduled function to collect custom brand statistics from gear collection
export const findCustomBrands = functions
    .region('asia-northeast1')
    .pubsub.schedule('every 5 minutes') // changed for testing
    .timeZone('Asia/Taipei')
    .onRun(async (context) => {
        const db = admin.firestore();
        // Use where clause to only get gears with brand.custom
        const gearSnapshot = await db
            .collection('gear')
            .where('brand.custom', '!=', null)
            .get();
        const brandCounts: Record<string, number> = {};

        gearSnapshot.forEach((doc) => {
            const gear = doc.data();
            const customBrand = gear?.brand?.custom;
            if (
                customBrand &&
                typeof customBrand === 'string' &&
                customBrand.trim()
            ) {
                // Normalize brand name: trim, lowercase, and collapse multiple spaces
                const brandName = customBrand
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, ' ');
                brandCounts[brandName] = (brandCounts[brandName] || 0) + 1;
            }
        });

        await db.collection('customBrands').add({
            created: admin.firestore.FieldValue.serverTimestamp(),
            brands: brandCounts,
            gearCount: Object.values(brandCounts).reduce(
                (sum, count) => sum + count,
                0,
            ),
            brandCount: Object.keys(brandCounts).length,
        });

        return null;
    });
