import Papa from 'papaparse';

const parseCsv = (file: File): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.result) {
                Papa.parse(reader.result as string, {
                    complete: (results: any) => {
                        const data = results.data as string[][];
                        if (data.length > 1) {
                            resolve(data.slice(1)); // Return rows from the second row onward
                        } else {
                            resolve([]);
                        }
                    },
                    error: (error: any) => {
                        reject(error.message);
                    },
                });
            } else {
                reject('FileReader result is empty');
            }
        };

        reader.onerror = () => {
            reject('Error reading file');
        };

        reader.readAsText(file);
    });
};

const supportsImage = async (imgSrc: string) => {
    return new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imgSrc;
    });
};

export default {
    parseCsv,
    supportsImage,
};
