const AuthsService = require('../services/auths.service.js');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const Cache = require('memory-cache');
const { createRandomNumber } = require('../../util/auth-encryption.util');
const axios = require('axios');

class AuthsController {
    authsService = new AuthsService();

    loginKakao = async (req, res) => {
        try {
            let code = req.query.code;
            const result = await this.authsService.loginKakao(code);

            if (result.accessToken && result.refreshToken) {
                const { userId } = jwt.verify(
                    result.accessToken,
                    process.env.TOKEN_USER_SECRET_KEY
                );
                console.log(`accessToken = ${result.accessToken}`);

                res.header({
                    accesstoken: `Bearer ${result.accessToken}`,
                    refreshtoken: `Bearer ${result.refreshToken}`,
                });
                res.status(200).json({
                    userId: userId,
                });
            } else {
                res.status(200).json({ user: result });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ errorMessage: '로그인 실패' });
        }
    };

    loginNaver = async (req, res) => {
        try {
            const code = req.query.code;
            const state = req.query.state;

            const result = await this.authsService.loginNaver(code, state);

            if (result.accessToken && result.refreshToken) {
                const { userId } = jwt.verify(
                    result.accessToken,
                    process.env.TOKEN_USER_SECRET_KEY
                );
                console.log(`accessToken = ${result.accessToken}`);

                res.header({
                    accesstoken: `Bearer ${result.accessToken}`,
                    refreshtoken: `Bearer ${result.refreshToken}`,
                });
                res.status(200).json({
                    userId: userId,
                });
            } else {
                res.status(200).json({ user: result });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ errorMessage: '네이버 로그인 실패' });
        }
    };

    loginGoogle = async (req, res) => {
        try {
            let code = req.query.code;
            const result = await this.authsService.loginGoogle(code);

            if (result.accessToken && result.refreshToken) {
                const { userId } = jwt.verify(
                    result.accessToken,
                    process.env.TOKEN_USER_SECRET_KEY
                );
                console.log(`accessToken = ${result.accessToken}`);

                res.header({
                    accesstoken: `Bearer ${result.accessToken}`,
                    refreshtoken: `Bearer ${result.refreshToken}`,
                });
                res.status(200).json({
                    userId: userId,
                });
            } else {
                res.status(200).json({ user: result });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ errorMessage: '구글 로그인 실패' });
        }
    };

    sendMessage = async (req, res) => {
        try {
            const { phoneNumber } = req.params;

            const user = await this.authsService.findDupPhone(phoneNumber);

            if (user) {
                return res.status(412).json({
                    errorMessage: '이미 사용되고 있는 핸드폰 번호입니다.',
                });
            }

            const tel = phoneNumber.split('-').join('');
            const verificationCode = createRandomNumber();
            const date = Date.now().toString();

            Cache.del(tel);
            Cache.put(tel, verificationCode);

            const method = 'POST';
            const space = ' ';
            const newLine = '\n';
            const url = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.SMS_API_KEY}/messages`;
            const url2 = `/sms/v2/services/${process.env.SMS_API_KEY}/messages`;

            const hmac = CryptoJS.algo.HMAC.create(
                CryptoJS.algo.SHA256,
                process.env.SMS_SECRET_KEY
            );
            hmac.update(method);
            hmac.update(space);
            hmac.update(url2);
            hmac.update(newLine);
            hmac.update(date);
            hmac.update(newLine);
            hmac.update(process.env.SMS_ACCESS_KEY);
            const hash = hmac.finalize();
            const signature = hash.toString(CryptoJS.enc.Base64);

            const smsRes = await axios({
                method: method,
                url: url,
                headers: {
                    'Contenc-type': 'application/json; charset=utf-8',
                    'x-ncp-iam-access-key': process.env.SMS_ACCESS_KEY,
                    'x-ncp-apigw-timestamp': date,
                    'x-ncp-apigw-signature-v2': signature,
                },
                data: {
                    type: 'SMS',
                    countryCode: '82',
                    from: '01066307548',
                    content: `인증번호는 [${verificationCode}] 입니다.`,
                    messages: [{ to: `${tel}` }],
                },
            });

            console.log('문자보내짐?!!', smsRes.data);
            res.status(200).json({ message: '인증번호 발송 완료!' });
        } catch (error) {
            Cache.del(tel);
            console.log(error);
            res.status(400).json({ errorMessage: '인증번호 발송 실패' });
        }
    };

    verifyCode = async (req, res) => {
        const { phoneNumber, verifyCode } = req.body;
        console.log('verifyCode =======', phoneNumber, verifyCode);
        const tel = phoneNumber.split('-').join('');

        const CacheData = Cache.get(tel);
        console.log(CacheData);
        if (!CacheData) {
            return res
                .status(400)
                .json({ errorMessage: '인증번호를 다시 요청해주세요.' });
        }

        if (CacheData !== verifyCode) {
            return res
                .status(400)
                .json({ errorMessage: '인증번호를 다시 요청해주세요.' });
        }

        Cache.del(phoneNumber);
        return res.status(201).json({ message: '인증성공!' });
    };

    signUp = async (req, res) => {
        try {
            const {
                email,
                userName,
                password,
                phoneNumber,
                profileImg,
                provider,
                snsId,
            } = req.body;

            const { accessToken, refreshToken } =
                await this.authsService.signUp(
                    email,
                    userName,
                    password,
                    phoneNumber,
                    profileImg,
                    provider,
                    snsId
                );

            const { userId } = jwt.verify(
                accessToken,
                process.env.TOKEN_USER_SECRET_KEY
            );
            console.log(`accessToken = ${accessToken}`);

            res.header({
                accesstoken: `Bearer ${accessToken}`,
                refreshtoken: `Bearer ${refreshToken}`,
            });
            res.status(200).json({
                userId: userId,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '회원가입에 실패하였습니다.',
            });
        }
    };
}
module.exports = AuthsController;
