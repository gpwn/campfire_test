const LikesRepository = require('../repositories/likes.repository.js');
const UsersRepository = require('../repositories/users.repository.js');
const CampsRepository = require('../repositories/camps.repository.js');
const {
    ValidationError,
    InvalidParamsError,
    ExistError,
} = require('../../middlewares/exceptions/error.class.js');
const { Books, Camps, Hosts, Users, Likes } = require('../../models');

class LikesService {
    constructor() {
        this.likesRepository = new LikesRepository(Camps, Users, Likes);
    }
    usersRepository = new UsersRepository(Users);
    campsRepository = new CampsRepository(Books, Camps, Hosts, Users);

    changeLike = async (campId, userId) => {
        const findUser = await this.usersRepository.findOneUser(userId);
        const findCamps = await this.campsRepository.findCampById(campId);

        if (!findCamps) {
            throw new InvalidParamsError('찜할 수 없는 캠핑장입니다.', 400);
        }

        const findLike = await this.likesRepository.isExistLike(campId, userId);

        let userlike = Number(findUser.likes);
        let camplike = Number(findCamps.likes);
        let message = '';
        if (!findLike) {
            await this.likesRepository.addLike(campId, userId);
            userlike += Number(1);
            camplike += Number(1);
            message = '좋아요 성공!';
        } else {
            await this.likesRepository.deleteLike(campId, userId);
            userlike -= Number(1);
            camplike -= Number(1);
            message = '좋아요 취소!';
        }

        await this.likesRepository.userLikeupdate(userId, userlike);
        await this.likesRepository.campLikeupdate(campId, camplike);
        return message;
    };

    getUserLikes = async (userId) => {
        const findLikesByUser = await this.likesRepository.findLikeByPk(userId);

        return findLikesByUser.map((findLikeByUser) => {
            return {
                likeId: findLikeByUser.likeId,
                userId: findLikeByUser.userId,
                campId: findLikeByUser.campId,
                campName: findLikeByUser['Camp.campName'],
                campMainImage: findLikeByUser['Camp.campMainImage'],
                campAddress: findLikeByUser['Camp.campAddress'],
                typeLists:
                    findLikeByUser['Type.typeLists'] === null
                        ? null
                        : findLikeByUser['Type.typeLists'].split(','),
                createdAt: findLikeByUser.createdAt,
                updatedAt: findLikeByUser.updatedAt,
            };
        });
    };
}

module.exports = LikesService;
