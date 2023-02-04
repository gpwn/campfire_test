require('dotenv').config();
const env = process.env;
const { createHmac } = require('crypto');

const hash = (password) => {
    return createHmac('sha256', env.CRYPTO_SECRET_KEY)
        .update(password)
        .digest('hex');
};

const createRandomNumber = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code + '';
};

module.exports = { hash, createRandomNumber };
