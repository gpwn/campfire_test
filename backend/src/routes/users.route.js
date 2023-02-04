const express = require('express');
const UsersController = require('../architecture/controllers/users.controller');
const usersController = new UsersController();
const router = express.Router();
const upload = require('../modules/profileImg.js');
const authLoginUserMiddleware = require('../middlewares/authLoginUser.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');

// 회원가입
router.post('/signup', upload.single('profileImg'), usersController.signUp);
// 회원가입시 중복 검사
router.get('/signup/findDup', usersController.findDup);
//로그인
router.post('/login', authLoginUserMiddleware, usersController.logIn);
//회원 상세 정보
router.get('/', authUserMiddleware, usersController.findOneUser);
// 회원 정보 수정
router.put(
    '/',
    authUserMiddleware,
    upload.single('profileImg'),
    usersController.updateUser
);
// 회원 탈퇴
router.delete('/', authUserMiddleware, usersController.deleteUser);
// 문자 인증
router.get('/sms/:phoneNumber', usersController.sendMessage);
router.post('/sms/verify', usersController.verifyCode);
// 유저 이메일 찾기
router.get('/find/userEmail', usersController.findUserEmail);
// 유저 비밀번호 변경하기
router.put('/update/userPW', usersController.updateUserPW);

module.exports = router;
