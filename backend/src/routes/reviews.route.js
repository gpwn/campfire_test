const express = require('express');
const router = express.Router();
const authUserMiddleware = require('../middlewares/authUser.middleware');

const ReviewsController = require('../architecture/controllers/reviews.controller.js');
const reviewsController = new ReviewsController();
// 리뷰 작성
router.post(
    '/:campId/reviews',
    authUserMiddleware,
    reviewsController.createReview
);
// 리뷰 수정
router.put(
    '/:campId/reviews/:reviewId',
    authUserMiddleware,
    reviewsController.updateReview
);
// 리뷰 삭제
router.delete(
    '/:campId/reviews/:reviewId',
    authUserMiddleware,
    reviewsController.deleteReview
);
// 리뷰 조회(페이지네이션)
router.get('/:campId/reviews/page', reviewsController.getReviewsByPage);
module.exports = router;
