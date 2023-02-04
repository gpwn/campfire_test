const ReviewsRepository = require('../repositories/reviews.repository.js');
const {
    ValidationError,
    InvalidParamsError,
    ExistError,
} = require('../../middlewares/exceptions/error.class.js');

const { Camps, Users, Books, Reviews } = require('../../models');

class ReviewsService {
    constructor() {
        this.reviewsRepository = new ReviewsRepository(
            Camps,
            Users,
            Books,
            Reviews
        );
    }
    // 리뷰 작성
    createReview = async (content, campId, userId) => {
        const isExistReview = await this.reviewsRepository.getIsExistReview(
            campId,
            userId
        );
        if (isExistReview) {
            throw new ExistError('작성한 리뷰가 존재합니다.', 409);
        }
        const createdReview = await this.reviewsRepository.createReview(
            content,
            campId,
            userId
        );
        if (!createdReview) {
            throw new InvalidParamsError('리뷰 등록에 실패하였습니다.', 400);
        }
        return createdReview;
    };
    // 예약된 유저 찾기
    findReservedUser = async (userId, campId) => {
        const user = await this.reviewsRepository.findReservedUser(
            userId,
            campId
        );
        return user;
    };
    // 리뷰 수정
    updateReview = async (content, reviewId, campId, userId) => {
        const previousReview = await this.reviewsRepository.findOneReview(
            reviewId
        );
        if (!previousReview)
            throw new ValidationError('존재하지 않는 리뷰입니다.', 404);

        const camp = await this.reviewsRepository.findOneCamp(campId);
        if (!camp)
            throw new ValidationError('존재하지 않는 캠핑장입니다.', 404);

        if (previousReview.userId !== userId)
            throw new ValidationError(
                '본인이 작성한 리뷰만 수정 가능합니다.',
                401
            );
        await this.reviewsRepository.updateReview(
            content,
            reviewId,
            campId,
            userId
        );
        const updatedReview = await this.reviewsRepository.findOneReview(
            reviewId
        );
        if (previousReview.content === updatedReview.content) {
            throw new ValidationError('리뷰 수정에 실패하였습니다', 400);
        }
    };
    // 리뷰 삭제
    deleteReview = async (reviewId, campId, userId) => {
        const previousReview = await this.reviewsRepository.findOneReview(
            reviewId
        );
        if (!previousReview)
            throw new ValidationError('존재하지 않는 리뷰입니다.', 404);

        const camp = await this.reviewsRepository.findOneCamp(campId);
        if (!camp)
            throw new ValidationError('존재하지 않는 캠핑장입니다.', 404);

        if (previousReview.userId !== userId)
            throw new ValidationError(
                '본인이 작성한 리뷰만 삭제 가능합니다.',
                401
            );
        await this.reviewsRepository.deleteReview(reviewId, campId, userId);

        const deletedReview = await this.reviewsRepository.findOneReview(
            reviewId
        );
        if (deletedReview) {
            throw new ValidationError('리뷰 삭제에 실패하였습니다', 400);
        }
    };
    // 리뷰 조회(페이지네이션)
    getReviewsByPage = async (campId, pageNo) => {
        let start = 0;
        if (pageNo <= 0) {
            pageNo = 1;
        } else {
            start = (pageNo - 1) * 5;
        }
        const reviews = await this.reviewsRepository.getReviewsByPage(
            campId,
            start
        );
        if (!reviews) {
            throw new InvalidParamsError(
                '존재하지 않는 리뷰 페이지입니다.',
                404
            );
        }
        return reviews;
    };
}

module.exports = ReviewsService;
