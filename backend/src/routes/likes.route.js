const express = require('express');
const router = express.Router();
const authUserMiddleware = require('../middlewares/authUser.middleware.js');

const LikesController = require('../architecture/controllers/likes.controller.js');
const likesController = new LikesController();

// 유저 찜하기 기능
router.put('/:campId', authUserMiddleware, likesController.changeLike);
// 유저 찜하기 조회
router.get('/', authUserMiddleware, likesController.getUserLikes);

module.exports = router;
