import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_PASSWORD_SECRET_KEY || '';

export const encryptPassword = (password: string): string => {
    if (!SECRET_KEY) {
        console.error('Encryption key is missing!');
        return password;
    }
    return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};
