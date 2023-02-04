const { Users, Hosts } = require('../models');
const jwt = require('jsonwebtoken');
const {
    createUserToken,
    createHostToken,
} = require('../util/auth-jwtToken.util');
const env = process.env;

const validateUserToken = function (tokenValue) {
    try {
        const { userId } = jwt.verify(tokenValue, env.TOKEN_USER_SECRET_KEY);
        return userId;
    } catch (error) {
        return false;
    }
};

const validateHostToken = function (tokenValue) {
    try {
        const { hostId } = jwt.verify(tokenValue, env.TOKEN_HOST_SECRET_KEY);
        return hostId;
    } catch (error) {
        return false;
    }
};

module.exports = async (req, res, next) => {
    const accessToken = req.headers.accesstoken;
    const refreshToken = req.headers.refreshtoken;

    if (accessToken === undefined && refreshToken === undefined) {
        return next();
    }

    const [accessTokenType, accessTokenValue] = (accessToken || '').split(' ');
    const [refreshTokenType, refreshTokenValue] = (refreshToken || '').split(
        ' '
    );

    try {
        const userId = validateUserToken(accessTokenValue);
        const hostId = validateHostToken(accessTokenValue);
        if (!userId && !hostId) {
            console.log('일단 엑세스 토큰 만료!');
            if (
                !validateUserToken(refreshTokenValue) &&
                !validateHostToken(refreshTokenValue)
            ) {
                console.log('리프레쉬토큰도 만료!');
                throw 'Token이 만료되었습니다. 다시 로그인해주세요.';
            }
            const user = await Users.findOne({
                where: { token: refreshTokenValue },
            });
            const host = await Hosts.findOne({
                where: { token: refreshTokenValue },
            });
            if (!user && !host) {
                throw 'RefreshToken이 조작되었습니다. 다시 로그인해주세요.';
            }
            if (user && !host) {
                const newUserAccessToken = createUserToken(
                    user.dataValues.userId,
                    '1h'
                );
                console.log(`새로발급받은 액세스: ${newUserAccessToken}`);
                res.header({ accesstoken: `Bearer ${newUserAccessToken}` });
                res.locals.userId = user.dataValues.userId;
                return next();
            } else if (!user && host) {
                const newHostAccessToken = createHostToken(
                    host.dataValues.userId,
                    '1h'
                );
                console.log(`새로발급받은 액세스: ${newHostAccessToken}`);
                res.header({ accesstoken: `Bearer ${newHostAccessToken}` });
                res.locals.hostId = host.dataValues.hostId;
                return next();
            }
        } else if (userId && !hostId) {
            res.locals.userId = userId;
            next();
        } else if (!userId && hostId) {
            res.locals.hostId = hostId;
            next();
        }
    } catch (error) {
        if (error === 'Token이 만료되었습니다. 다시 로그인해주세요.') {
            res.status(419).json({
                errorMessage: 'Token이 만료되었습니다. 다시 로그인해주세요.',
            });
        } else if (error === '존재하지 않는 사용자입니다.') {
            res.status(404).json({
                errorMessage: '존재하지 않는 사용자입니다.',
            });
        } else if (
            error === 'RefreshToken이 조작되었습니다. 다시 로그인해주세요.'
        ) {
            res.status(404).json({
                errorMessage:
                    'RefreshToken이 조작되었습니다. 다시 로그인해주세요.',
            });
        } else {
            console.log(error);
            res.status(400).json({
                errorMessage: '로그인이 필요한 기능입니다.',
            });
        }
    }
};
