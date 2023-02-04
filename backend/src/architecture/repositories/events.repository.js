const { Op } = require('sequelize');
const { sequelize } = require('../../models');

class EventsRepository {
    #CampsModel;
    #TypesModel;
    #ReviewsModel;
    constructor(CampsModel, TypesModel, ReviewsModel) {
        this.#CampsModel = CampsModel;
        this.#TypesModel = TypesModel;
        this.#ReviewsModel = ReviewsModel;
    }

    getPremiumCamps = async () => {
        return await this.#CampsModel.findAll({
            where: { premium: true },
            include: [
                {
                    model: this.#TypesModel,
                    as: 'Types',
                    attributes: ['typeLists'],
                },
                {
                    model: this.#ReviewsModel,
                    as: 'Reviews',
                    attributes: ['reviewId'],
                },
            ],
        });
    };

    getLikesCamps = async () => {
        return await this.#CampsModel.findAll({
            limit: 9,
            attributes: ['campName', 'campId', 'likes'],
            order: [['likes', 'DESC']],
        });
    };

    getReviewsCamps = async () => {
        return await this.#CampsModel.findAll({
            where: { premium: true },
            attributes: ['campName', 'campId'],
            include: [
                {
                    model: this.#ReviewsModel,
                    as: 'Reviews',
                    attributes: ['reviewId'],
                },
            ],
        });
    };
}

module.exports = EventsRepository;
