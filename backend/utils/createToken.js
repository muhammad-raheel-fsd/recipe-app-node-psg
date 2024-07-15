const jwt = require("jsonwebtoken");

const createToken = (
  payload,
  secret = process.env.JWT_SECRET ?? 'RECIPEDIA_SECRET',
  expiry = 7 * 24 * 60 * 60
) => jwt.sign(payload, secret, { expiresIn: expiry });

module.exports = createToken;
