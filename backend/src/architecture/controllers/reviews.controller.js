const ReviewsService = require('../services/reviews.service.js');
const {
    InvalidParamsError,
    ValidationError,
} = require('../../middlewares/exceptions/error.class');

class ReviewsController {
    constructor() {
        this.reviewsService = new ReviewsService();
    }
    // 리뷰 작성
    createReview = async (req, res, next) => {
        try {
            const { content } = req.body;
            const { campId } = req.params;
            const { userId } = res.locals;

            if (!content) {
                throw new InvalidParamsError();
            }

            const user = await this.reviewsService.findReservedUser(
                userId,
                campId
            );

            if (!user) {
                throw new ValidationError(
                    '캠핑장 예약 날짜 이전에 리뷰 작성을 할 수 없습니다.',
                    400
                );
            }

            const { reviewId } = await this.reviewsService.createReview(
                content,
                campId,
                userId
            );
            res.status(201).json({
                message: '리뷰가 등록되었습니다.',
                reviewId: reviewId,
            });
        } catch (error) {
            next(error);
        }
    };
    // 리뷰 수정
    updateReview = async (req, res, next) => {
        try {
            const { content } = req.body;
            const { campId, reviewId } = req.params;
            const { userId } = res.locals;

            if (!content) {
                throw new InvalidParamsError();
            }

            await this.reviewsService.updateReview(
                content,
                reviewId,
                campId,
                userId
            );
            res.status(201).json({ message: '리뷰가 수정되었습니다.' });
        } catch (error) {
            next(error);
        }
    };
    // 리뷰 삭제
    deleteReview = async (req, res, next) => {
        try {
            const { campId, reviewId } = req.params;
            const { userId } = res.locals;

            await this.reviewsService.deleteReview(reviewId, campId, userId);
            res.status(200).json({ message: '리뷰가 삭제되었습니다.' });
        } catch (error) {
            next(error);
        }
    };
    // 리뷰 조회(페이지네이션)
    getReviewsByPage = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const pageInfo = req.query;
            const pageNo = pageInfo.pageno;
            if (!pageInfo) {
                throw new InvalidParamsError();
            }
            const reviews = await this.reviewsService.getReviewsByPage(
                campId,
                pageNo
            );
            res.status(200).json({ reviews });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ReviewsController;
