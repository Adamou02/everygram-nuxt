import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage';
// @ts-ignore
import { v4 as uuid } from 'uuid';

export default function () {
    const storage = getStorage();
    const isUploading = ref(false);
    const uploadFile = async ({
        file,
        path,
        fileName,
    }: {
        file: File | Blob;
        path: string;
        fileName?: string;
    }) => {
        try {
            const _fileName = fileName || uuid();
            isUploading.value = true;
            const fileRef = storageRef(storage, `${path}/${_fileName}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            return {
                fileName: _fileName,
                downloadUrl,
            };
        } catch (error) {
            console.error(error);
        } finally {
            isUploading.value = false;
        }
    };

    return {
        isUploading,
        uploadFile,
    };
}
