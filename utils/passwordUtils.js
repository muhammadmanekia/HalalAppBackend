const crypto = require("crypto");

exports.hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
};

exports.comparePassword = (password, hash) => {
  const [salt, key] = hash.split(":");
  const hashBuffer = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), hashBuffer);
};
