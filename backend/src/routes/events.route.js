const express = require('express');
const router = express.Router();
const likeConfirmUserHostMiddleware = require('../middlewares/likeConfirmUserHost.middleware');

const EventsController = require('../architecture/controllers/events.controller');
const eventsController = new EventsController();

//프리미엄 캠핑장 조회
router.get(
    '/premium',
    likeConfirmUserHostMiddleware,
    eventsController.getPremiumCamps
);
//찜하기 순 캠핑장
router.get('/likes', eventsController.getLikesCamps);
//리뷰 순 캠핑장
router.get('/reviews', eventsController.getReviewsCamps);

module.exports = router;
