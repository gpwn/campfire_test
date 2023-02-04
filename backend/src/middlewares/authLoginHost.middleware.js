const jwt = require('jsonwebtoken');
const env = process.env;
const { AuthenticationError } = require('./exceptions/error.class');

const validateToken = function (tokenValue) {
    try {
        jwt.verify(tokenValue, env.TOKEN_HOST_SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = async (req, res, next) => {
    const refreshToken = req.headers.refreshtoken;

    try {
        if (!refreshToken) return next();

        if (!validateToken(refreshToken))
            throw new AuthenticationError('이미 로그인이 되어있습니다.', 403);

        next();
    } catch (error) {
        next(error);
    }
};
