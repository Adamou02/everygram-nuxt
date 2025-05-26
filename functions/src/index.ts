import * as admin from 'firebase-admin';
import { setGlobalOptions } from 'firebase-functions/v2';
import serviceAccount from './everygram-firebase-adminsdk.json';

// Set the maximum instances to 10 for all functions
// To fix Error: Error generating the service identity for eventarc.googleapis.com.
setGlobalOptions({
    maxInstances: 10,
    region: 'asia-northeast1',
    timeoutSeconds: 60,
});

// set credential for admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: 'everygram.appspot.com',
});

export { onGearUpdated } from './on-gear-updated';
export { onGearDeleted } from './on-gear-deleted';
export { onTripUpdated } from './on-trip-updated';
export { onTripDeleted } from './on-trip-deleted';
export { incrementTripShareView } from './increment-tripshare-view';
export { onUserProfileUpdated } from './on-user-profile-updated';
export { findCustomBrands } from './cron-jobs/find-custom-brands';
