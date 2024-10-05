const cryptoJS = require("crypto-js");

exports.encryptData = (data, secretKey) => {
  try {
    // Ensure the data is valid JSON
    return cryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  } catch (error) {
    console.error("Encryption failed:", error.message);
    throw new Error("Encryption error");
  }
};

exports.decryptData = (encryptedData, secretKey) => {
  try {
    if (!encryptedData || typeof encryptedData !== "string") {
      throw new Error("Invalid encrypted data format");
    }

    const bytes = cryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedText = bytes.toString(cryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Decryption failed, invalid secret key or data.");
    }

    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("Decryption failed:", error.message);
    throw new Error("Decryption error");
  }
};
