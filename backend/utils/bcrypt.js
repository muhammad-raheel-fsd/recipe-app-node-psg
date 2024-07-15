const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

const validatePassword = async (newPassword, existingPassword) => {
  return await bcrypt.compare(newPassword, existingPassword);
};

module.exports = { hashPassword, validatePassword };