// @ts-nocheck
const jwt = require('jsonwebtoken');

// Must match SECRET_KEY in server.js
const SECRET_KEY = 'super_secret_key_that_should_not_be_here';

/**
 * Returns a valid Bearer token for a seeded test user.
 * @param {number} userId - defaults to 1 (admin user in database.sqlite seed)
 */
function getAuthToken(userId = 1) {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = { getAuthToken };
