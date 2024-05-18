import Papa from 'papaparse';

// prompt: write a function to format an image file to jpeg quality 0.8, params: file: File, maxWidth: number, maxHeight: number. Keep aspect ratio of the image
const formatImageToJpeg = async (
    file: File,
    options: { maxWidth: number; maxHeight: number; quality?: number },
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = function () {
                // Calculate the new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > options.maxWidth || height > options.maxHeight) {
                    const aspectRatio = width / height;

                    if (width > height) {
                        width = options.maxWidth;
                        height = Math.floor(options.maxWidth / aspectRatio);
                    } else {
                        height = options.maxHeight;
                        width = Math.floor(options.maxHeight * aspectRatio);
                    }
                }

                // Create a canvas to draw the resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Canvas is empty'));
                            }
                        },
                        'image/jpeg',
                        options.quality || 0.6, // JPEG quality
                    );
                } else {
                    reject(new Error('Could not get canvas context'));
                }
            };

            img.onerror = function () {
                reject(new Error('Error loading image'));
            };

            if (event.target && event.target.result) {
                img.src = event.target.result as string;
            } else {
                reject(new Error('File reader error'));
            }
        };

        reader.onerror = function () {
            reject(new Error('File reading error'));
        };

        reader.readAsDataURL(file);
    });
};

function parseCsv(file: File): Promise<string[][]> {
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
}

export default {
    formatImageToJpeg,
    parseCsv,
};
