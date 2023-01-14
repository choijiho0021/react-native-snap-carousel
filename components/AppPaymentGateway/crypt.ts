import CryptoJS from 'crypto-js';

export const encryptAES256 = (text: string, keyStr: string) => {
  const iv = CryptoJS.enc.Hex.parse(keyStr);
  const key = CryptoJS.enc.Utf8.parse(keyStr);
  return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.ECB, // [cbc 모드 선택]
  }).toString();
};

export const decryptAES256 = (text: string, keyStr: string) => {
  const iv = CryptoJS.enc.Hex.parse(keyStr);
  const key = CryptoJS.enc.Utf8.parse(keyStr);
  return CryptoJS.AES.decrypt(text, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.ECB,
  }).toString(CryptoJS.enc.Utf8);
};

export const encryptSHA256 = (text: string) => {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
};
