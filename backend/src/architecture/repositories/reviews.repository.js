const { Op } = require('sequelize');

class ReviewsRepository {
    #CampsModel;
    #UsersModel;
    #BooksModel;
    #ReviewsModel;
    constructor(CampsModel, UsersModel, BooksModel, ReveiwsModel) {
        this.#CampsModel = CampsModel;
        this.#UsersModel = UsersModel;
        this.#BooksModel = BooksModel;
        this.#ReviewsModel = ReveiwsModel;
    }
    // 리뷰 작성
    createReview = async (content, campId, userId) => {
        const createdReview = await this.#ReviewsModel.create({
            content,
            campId,
            userId,
        });
        return createdReview;
    };
    // 예약된 유저 찾기
    findReservedUser = async (userId, campId) => {
        const user = await this.#BooksModel.findOne({
            where: {
                [Op.and]: [{ userId, campId }],
                checkOutDate: { [Op.lt]: getToday() },
            },
        });
        return user;
    };
    // 내가 작성한 리뷰 찾기
    getIsExistReview = async (userId, campId) => {
        const review = await this.#ReviewsModel.findOne({
            where: { [Op.and]: [{ userId, campId }] },
        });
        return review;
    };
    // 리뷰 수정
    updateReview = async (content, reviewId, campId, userId) => {
        await this.#ReviewsModel.update(
            { content, reviewId, campId, userId },
            {
                where: {
                    [Op.and]: [{ reviewId, campId, userId }],
                },
            }
        );
    };
    // 리뷰 조회(reviewId)
    findOneReview = async (reviewId) => {
        const review = await this.#ReviewsModel.findOne({
            where: { reviewId },
        });
        return review;
    };
    // 캠핑장 조회(campId)
    findOneCamp = async (campId) => {
        const camp = await this.#CampsModel.findOne({
            where: { campId },
        });
        return camp;
    };
    // 리뷰 삭제
    deleteReview = async (reviewId, campId, userId) => {
        await this.#ReviewsModel.destroy({
            where: {
                [Op.and]: [{ reviewId, campId, userId }],
            },
        });
    };
    // 리뷰 조회(페이지네이션)
    getReviewsByPage = async (campId, start) => {
        const reviews = await this.#ReviewsModel.findAll({
            where: { campId: { [Op.eq]: campId } },
            offset: start,
            limit: 5,
            order: [['createdAt', 'ASC']],
        });
        return reviews;
    };
}
function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ('0' + (1 + date.getMonth())).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}
module.exports = ReviewsRepository;
