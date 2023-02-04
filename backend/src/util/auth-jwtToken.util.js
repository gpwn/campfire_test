const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;

function createUserToken(id, duration) {
    return jwt.sign({ userId: id }, env.TOKEN_USER_SECRET_KEY, {
        expiresIn: duration,
    });
}
function createHostToken(id, duration) {
    return jwt.sign({ hostId: id }, env.TOKEN_HOST_SECRET_KEY, {
        expiresIn: duration,
    });
}

module.exports = { createUserToken, createHostToken };
