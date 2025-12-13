import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.PASSWORD_SECRET_KEY || '';

export const decryptPassword = (cipherText: string): string => {
    if (!SECRET_KEY) {
        throw new Error('Server encryption key is missing');
    }
    if (!cipherText) return cipherText;

    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalText) {
        throw new Error('Decryption failed. Invalid payload.');
    }

    return originalText;
};
