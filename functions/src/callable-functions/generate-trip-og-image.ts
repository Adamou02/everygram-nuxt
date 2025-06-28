import * as admin from 'firebase-admin';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/**
 * Generates a trip OG image, uploads it to storage, and updates tripMeta.ogImageUrl.
 * @param tripId Trip ID
 * @returns ogImageUrl
 */
export const generateTripOgImageAndUpdateMeta = async (
    tripId: string,
): Promise<string | undefined> => {
    if (!tripId || typeof tripId !== 'string') {
        throw new Error('tripId is required and must be a string');
    }

    // 1. Launch Puppeteer
    const executablePath = await chromium.executablePath;
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(`https://everygram.app/trip-og-image/${tripId}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000, // Increased timeout to 60 seconds
    });
    // Add delay to ensure all assets are loaded/rendered
    await page.waitForTimeout(5000);

    // 2. Save screenshot to temp file
    const tempFilePath = `/tmp/og-image-${tripId}.jpeg`;
    await page.screenshot({
        path: tempFilePath as `${string}.jpeg`,
        type: 'jpeg',
        quality: 80,
        clip: { x: 0, y: 0, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT },
    });
    await browser.close();

    // 3. Upload to Firebase Storage
    const bucket = admin.storage().bucket();
    const ogImagePath = `trip/${tripId}/og-image`;
    const file = bucket.file(`${ogImagePath}/og-image.jpeg`);
    await bucket.upload(tempFilePath, {
        destination: file,
        metadata: { contentType: 'image/jpeg' },
    });

    // 4. Get download URL
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2500',
    });

    // 5. Update tripMeta.ogImageUrl
    await admin
        .firestore()
        .collection('tripMeta')
        .doc(tripId)
        .set({ tripId, ogImageUrl: url }, { merge: true });

    return url;
};
