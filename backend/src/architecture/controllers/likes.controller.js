const LikesService = require('../services/likes.service.js');

class LikesController {
    constructor() {
        this.likesService = new LikesService();
    }

    changeLike = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { userId } = res.locals;

            const message = await this.likesService.changeLike(campId, userId);

            res.status(201).json({
                message,
                campId,
                userId,
            });
        } catch (error) {
            next(error);
        }
    };

    getUserLikes = async (req, res, next) => {
        try {
            const { userId } = res.locals;

            const Likes = await this.likesService.getUserLikes(userId);

            res.status(200).json({
                Likes,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = LikesController;
