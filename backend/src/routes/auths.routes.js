const express = require('express');
const router = express.Router();
const upload = require('../modules/profileImg.js');

const AuthsController = require('../architecture/controllers/auths.controller.js');
const authsController = new AuthsController();
const authLoginUserMiddleware = require('../middlewares/authLoginUser.middleware');

router.get('/kakao', authLoginUserMiddleware, authsController.loginKakao);
router.get('/naver', authLoginUserMiddleware, authsController.loginNaver);
router.get('/google', authLoginUserMiddleware, authsController.loginGoogle);
router.get('/sms/:phoneNumber', authsController.sendMessage);
router.post('/sms/verify', authsController.verifyCode);
router.post('/signup', authLoginUserMiddleware, authsController.signUp);
module.exports = router;
