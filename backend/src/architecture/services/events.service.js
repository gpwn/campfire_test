const EventsRepository = require('../repositories/events.repository');
const LikesRepository = require('../repositories/likes.repository.js');
const {
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

const {
    Books,
    Camps,
    Hosts,
    Users,
    Sites,
    CampAmenities,
    Envs,
    Types,
    Themes,
    Likes,
    Reviews,
} = require('../../models');

class EventsService {
    constructor() {}
    likesRepository = new LikesRepository(Camps, Users, Likes);
    eventsRepository = new EventsRepository(Camps, Types, Reviews);

    //프리미엄 캠핑장 조회
    getPremiumCamps = async (userId) => {
        const camps = await this.eventsRepository.getPremiumCamps();

        return await Promise.all(
            camps.map(async (camp) => {
                const findLike = await this.likesRepository.isExistLike(
                    camp.campId,
                    userId
                );
                let likeStatus = false;
                if (findLike) {
                    likeStatus = true;
                } else {
                    likeStatus = false;
                }
                return {
                    campId: camp.campId,
                    hostId: camp.hostId,
                    campName: camp.campName,
                    campAddress: camp.campAddress,
                    campMainImage: camp.campMainImage,
                    campSubImages:
                        camp.campSubImages === null
                            ? null
                            : camp.campSubImages.split(','),
                    campDesc: camp.campDesc,
                    typeLists:
                        camp.Types[0].typeLists === null
                            ? null
                            : camp.Types[0].typeLists.split(','),
                    checkIn: camp.checkIn,
                    checkOut: camp.checkOut,
                    likes: camp.likes,
                    likeStatus: likeStatus,
                    mapX: camp.mapX,
                    mapY: camp.mapY,
                    premium: camp.premium,
                    countReviews: camp.Reviews.length,
                    createdAt: camp.createdAt,
                    updatedAt: camp.updatedAt,
                };
            })
        );
    };
    //찜하기 순 캠핑장
    getLikesCamps = async () => {
        const likes = await this.eventsRepository.getLikesCamps();

        return likes;
    };
    //찜하기 순 캠핑장
    getReviewsCamps = async () => {
        const reviews = await this.eventsRepository.getReviewsCamps();

        let reviewsArr = [];
        for (let review of reviews) {
            reviewsArr.push({
                campName: review.campName,
                campId: review.campId,
                countReviews: review.Reviews.length,
            });
        }
        var sortingField = 'countReviews';
        reviewsArr.sort(function (a, b) {
            return b[sortingField] - a[sortingField];
        });
        reviewsArr = reviewsArr.slice(0, 9);

        return reviewsArr;
    };
}

module.exports = EventsService;
