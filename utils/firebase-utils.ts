import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const getFirestoreDB = () => {
    const db = getFirestore();
    // connectFirestoreEmulator(db, '127.0.0.1', 8080);
    return db;
};

export default {
    getFirestoreDB,
};
