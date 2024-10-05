const cryptoJS = require("crypto-js");

exports.encryptData = (data, secretKey) => {
  if (data) {
    return cryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString(
      cryptoJS.enc.Base64
    );
  }
};

exports.decryptData = (encryptedData, secretKey) => {
  if (encryptedData) {
    const bytes = cryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(cryptoJS.enc.Base64));
  }
};
