const cryptoJS = require("crypto-js");

exports.encryptData = (data, secretKey) => {
  return cryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

exports.decryptData = (encryptedData, secretKey) => {
  if (encryptedData) {
    const bytes = cryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
  }
};
