const express = require('express');
const HostsController = require('../architecture/controllers/hosts.controller');
const hostsController = new HostsController();
const router = express.Router();
const upload = require('../modules/profileImg.js');
const authLoginHostMiddleware = require('../middlewares/authLoginHost.middleware');
const authHostMiddleware = require('../middlewares/authHost.middleware');

router.post('/signup', upload.single('profileImg'), hostsController.signUp);
router.get('/signup/findDup', hostsController.findDup);
router.post('/signup/checkCompany', hostsController.checkCompany);
router.post('/login', authLoginHostMiddleware, hostsController.logIn);
router.get('/', authHostMiddleware, hostsController.findOneHost);
router.put(
    '/',
    authHostMiddleware,
    upload.single('profileImg'),
    hostsController.updateHost
);
router.delete('/', authHostMiddleware, hostsController.deleteHost);
// 문자 인증
router.get('/sms/:phoneNumber', hostsController.sendMessage);
router.post('/sms/verify', hostsController.verifyCode);
// 호스트 이메일 찾기
router.get('/find/hostEmail', hostsController.findHostEmail);
// 호스트 비밀번호 변경하기
router.put('/update/hostPW', hostsController.updateHostPW);

module.exports = router;
