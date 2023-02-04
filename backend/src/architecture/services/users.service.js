const UsersRepository = require('../repositories/users.repository');
const { Users } = require('../../models');
require('dotenv').config();
const { hash } = require('../../util/auth-encryption.util');
const { createUserToken } = require('../../util/auth-jwtToken.util.js');

class UsersService {
    usersRepository = new UsersRepository(Users);

    //회원가입 API
    signUp = async (email, userName, password, phoneNumber, profileImg) => {
        const hashValue = hash(password);
        const user = await this.usersRepository.createUser(
            email,
            userName,
            hashValue,
            phoneNumber,
            profileImg
        );
        return user;
    };

    //아이디/닉네임 중복확인 API
    findDup = async (query) => {
        const prop = Object.keys(query)[0];
        const value = Object.values(query)[0];
        if (prop === 'email') {
            const user = await this.usersRepository.findOneUserByEmail(value);
            if (user) {
                throw '이미 사용중인 이메일입니다.';
            } else {
                return '이메일 중복확인에 성공하였습니다.';
            }
        } else if (prop === 'userName') {
            const user = await this.usersRepository.findOneUserByUserName(
                value
            );
            if (user) {
                throw '이미 사용중인 닉네임입니다.';
            } else {
                return '닉네임 중복확인에 성공하였습니다.';
            }
        } else {
            throw 'Service findDup Error';
        }
    };

    logIn = async (email, password) => {
        const hashValue = hash(password);
        const user = await this.usersRepository.findUserByAuth(
            email,
            hashValue
        );

        if (!user) {
            throw '아이디 또는 패스워드가 일치하지 않습니다.';
        }

        const accessToken = createUserToken(user.userId, '1h');
        const refreshToken = createUserToken('refreshToken', '1d');
        await this.usersRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };

    findOneUser = async (userId) => {
        const user = await this.usersRepository.findOneUser(userId);
        if (!user) throw '존재하지 않는 사용자입니다.';

        const bookList = await this.usersRepository.findBooksListByUser(userId);
        const bookIdList = [];
        bookList.map((v) => {
            bookIdList.push(v.bookId);
        });

        return {
            userId: user.userId,
            email: user.email,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            profileImg: user.profileImg,
            bookIdList,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    };

    updateUser = async (userId, userName, profileImg) => {
        const user = await this.usersRepository.findOneUser(userId);
        if (!user) throw new Error('존재하지않는 사용자입니다.');

        if (
            (userName === undefined ||
                userName === null ||
                userName === user.userName) &&
            (profileImg === undefined || profileImg === null)
        ) {
            throw new Error('수정사항이 없습니다.');
        }

        if (userName === undefined || userName === null)
            userName = user.userName;
        if (profileImg === undefined || profileImg === null)
            profileImg = user.profileImg;

        await this.usersRepository.updateUser(userId, userName, profileImg);
    };

    deleteUser = async (userId) => {
        const user = await this.usersRepository.findOneUser(userId);

        await this.usersRepository.deleteUser(userId);

        let provider = '';
        if (user.provider === null) {
            provider = user.email;
        } else {
            provider = user.provider;
        }

        return provider;
    };

    // 유저 이메일 찾기
    findUserEmail = async (phoneNumber) => {
        const user = await this.usersRepository.findUserEmail(phoneNumber);

        if (!user) throw new Error('존재하지않는 사용자입니다.');
        if (user.provider !== null)
            throw new Error('sns는 이메일을 찾을 수 없습니다.');

        return user.email;
    };
    // 유저 비밀번호 변경하기
    updateUserPW = async (email, phoneNumber, password) => {
        const user = await this.usersRepository.findUserEmail(phoneNumber);
        if (!user) throw new Error('존재하지않는 사용자입니다.');
        if (user.email !== email)
            throw new Error('이메일과 전화번호를 확인하세요.');
        if (user.provider !== null)
            throw new Error('sns는 비밀번호를 변경할 수 없습니다.');

        const hashValue = hash(password);
        return await this.usersRepository.updateUserPW(
            email,
            phoneNumber,
            hashValue
        );
    };

    isExistPhoneNumber = async (phoneNumber) => {
        return await this.usersRepository.findUserEmail(phoneNumber);
    };
}

module.exports = UsersService;
