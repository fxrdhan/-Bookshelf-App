// pdf-storage.js

/**
 * Initializes the PDF database and object store
 */
const initPDFDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('BookshelfPDFDB', 1);

        request.onerror = () => {
            reject(new Error('Failed to open PDF database'));
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pdfs')) {
                // Create object store for PDFs with book ID as key
                const pdfStore = db.createObjectStore('pdfs', { keyPath: 'bookId' });
                pdfStore.createIndex('bookId', 'bookId', { unique: true });
            }
        };
    });
};

/**
 * Stores a PDF file in IndexedDB
 * @param {string} bookId - ID of the book
 * @param {string} pdfData - PDF file data as base64 string
 */
const storePDF = async (bookId, pdfData) => {
    // Validate PDF data format
    if (!pdfData.startsWith('data:application/pdf;base64,')) {
        throw new Error('Invalid PDF data format');
        try {
            const db = await initPDFDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['pdfs'], 'readwrite');
                const pdfStore = transaction.objectStore('pdfs');

                const request = pdfStore.put({
                    bookId: bookId,
                    pdfData: pdfData,
                    timestamp: new Date().getTime()
                });

                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(new Error('Failed to store PDF'));

                transaction.oncomplete = () => db.close();
            });
        } catch (error) {
            console.error('Error storing PDF:', error);
            throw error;
        }
    }
};

/**
    * Retrieves a PDF from IndexedDB
    * @param {string} bookId - ID of the book
    * @returns {Promise<string>} PDF data as base64 string
    */
const getPDF = async (bookId) => {
    try {
        const db = await initPDFDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['pdfs'], 'readonly');
            const pdfStore = transaction.objectStore('pdfs');
            const request = pdfStore.get(bookId);

            request.onsuccess = () => {
                if (request.result && request.result.pdfData) {
                    // Validate that we have valid base64 data
                    try {
                        const base64Data = request.result.pdfData.split(',')[1];
                        if (!base64Data) {
                            reject(new Error('Invalid PDF data format'));
                            return;
                        }
                        // Test if it's valid base64
                        atob(base64Data);
                        resolve(request.result.pdfData);
                    } catch (e) {
                        reject(new Error('Corrupted PDF data'));
                    }
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(new Error('Failed to retrieve PDF'));

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('Error retrieving PDF:', error);
        throw error;
    }
};

/**
    * Deletes a PDF from IndexedDB
    * @param {string} bookId - ID of the book
    */
const deletePDF = async (bookId) => {
    try {
        const db = await initPDFDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['pdfs'], 'readwrite');
            const pdfStore = transaction.objectStore('pdfs');
            const request = pdfStore.delete(bookId);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(new Error('Failed to delete PDF'));

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('Error deleting PDF:', error);
        throw error;
    }
};

export { initPDFDatabase, storePDF, getPDF, deletePDF };