const UsersRepository = require('../repositories/users.repository');
const AuthsRepository = require('../repositories/auths.repository.js');
const axios = require('axios');
const { Users } = require('../../models');
require('dotenv').config();
const { createUserToken } = require('../../util/auth-jwtToken.util.js');
const { ValidationError } = require('../../middlewares/exceptions/error.class');

class AuthsService {
    authsRepository = new AuthsRepository(Users);

    loginKakao = async (code) => {
        const resultPost = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_CLIENT_ID,
                    code,
                    redirect_uri: process.env.KAKAO_REDIRECT_URL,
                },
            }
        );
        const data = resultPost.data['access_token'];

        const resultGet = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${data}`,
                'Content`Type': `application/x-www-form-urlencoded;charset=utf-8`,
            },
        });

        console.log('=================', resultGet.data);

        const email = resultGet.data.kakao_account['email'];
        const userName = resultGet.data.properties['nickname'];
        const profileImg = resultGet.data.properties['profile_image'];
        const provider = 'kakao';
        const snsId = resultGet.data.id;
        console.log('typeof snsId = ', typeof snsId);

        if (!email || !userName)
            throw new ValidationError(
                '카카오 인증 정보가 올바르지 않습니다.',
                400
            );

        let user = await this.authsRepository.findOneUserBySnsId(snsId);

        if (user && user.provider !== provider) {
            throw new ValidationError(
                '다른 소셜사이트로 가입된 이메일이 존재합니다.',
                400
            );
        }

        if (!user) {
            return { email, userName, profileImg, snsId, provider };
        }
        const accessToken = createUserToken(user.userId, '1h');
        const refreshToken = createUserToken('refreshToken', '1d');
        await this.authsRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };

    loginNaver = async (code, state) => {
        const result = await axios.post(
            'https://nid.naver.com/oauth2.0/token',
            {},
            {
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.NAVER_CLIENT_ID,
                    client_secret: process.env.NAVER_SECRET,
                    code: code,
                    state: state,
                },
            }
        );
        const token = result.data.access_token;

        // 발급 받은 access token을 사용해 회원 정보 조회 API를 사용한다.
        const info_result = await axios.get(
            'https://openapi.naver.com/v1/nid/me',
            {
                headers: { Authorization: 'Bearer ' + token },
            }
        );

        const email = info_result.data.response.email;
        const userName = info_result.data.response.name;
        const profileImg = info_result.data.response.profile_image;
        const snsId = info_result.data.response.id;
        const provider = 'naver';

        if (!email || !userName)
            throw new ValidationError(
                '네이버 인증 정보가 올바르지 않습니다.',
                400
            );

        let user = await this.authsRepository.findOneUserBySnsId(snsId);

        if (user && user.provider !== provider) {
            throw new ValidationError(
                '다른 소셜사이트로 가입된 이메일이 존재합니다.',
                400
            );
        }

        if (!user) {
            return { email, userName, profileImg, snsId, provider };
        }
        const accessToken = createUserToken(user.userId, '1h');
        const refreshToken = createUserToken('refreshToken', '1d');
        await this.authsRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };

    loginGoogle = async (code) => {
        const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_SECRET}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&grant_type=authorization_code`;

        const access_token = await axios
            .post(url, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
            })
            .then((el) => {
                return el.data.access_token;
            })
            .catch((err) => {
                console.log('err=', err);
            });

        const googleAPI = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`;
        const userInfo = await axios
            .get(googleAPI, {
                headers: {
                    authorization: `Bearer ${access_token}`,
                },
            })
            .then((el) => {
                return el.data;
            })
            .catch((err) => {
                console.log('err=', err);
            });

        const email = userInfo.email;
        const userName = userInfo.name;
        const profileImg = userInfo.picture;
        const snsId = userInfo.id;
        const provider = 'google';

        if (!email || !userName) {
            throw new ValidationError(
                '구글 인증 정보가 올바르지 않습니다.',
                400
            );
        }

        let user = await this.authsRepository.findOneUserBySnsId(snsId);

        if (user && user.provider !== provider) {
            throw new ValidationError(
                '다른 소셜사이트로 가입된 이메일이 존재합니다.',
                400
            );
        }

        if (!user) {
            return { email, userName, profileImg, snsId, provider };
        }
        const accessToken = createUserToken(user.userId, '1h');
        const refreshToken = createUserToken('refreshToken', '1d');
        await this.authsRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };

    signUp = async (
        email,
        userName,
        password,
        phoneNumber,
        profileImg,
        provider,
        snsId
    ) => {
        const user = await this.authsRepository.createUser(
            email,
            userName,
            password,
            phoneNumber,
            profileImg,
            provider,
            snsId
        );

        const accessToken = createUserToken(user.userId, '1h');
        const refreshToken = createUserToken('refreshToken', '1d');
        await this.authsRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };

    findDupPhone = async (phoneNumber) => {
        return await this.authsRepository.findOneUserByPhone(phoneNumber);
    };
}

module.exports = AuthsService;
