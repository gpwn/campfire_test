const { Op } = require('sequelize');
const {
    getTypesIncludecondition,
    getCampAmenitiesIncludecondition,
    getEnvsIncludecondition,
    getThemesIncludecondition,
    getLocationIncludecondition,
} = require('../../modules/searchCamps.js');

class SearchRepository {
    #CampsModel;
    #SitesModel;
    #TypesModel;
    #ReviewsModel;
    #CampAmenitiesModel;
    #EnvsModel;
    #ThemesModel;
    #BooksModel;
    constructor(
        CampsModel,
        SitesModel,
        TypesModel,
        ReviewsModel,
        CampAmenitiesModel,
        EnvsModel,
        ThemesModel,
        BooksModel
    ) {
        this.#CampsModel = CampsModel;
        this.#SitesModel = SitesModel;
        this.#TypesModel = TypesModel;
        this.#ReviewsModel = ReviewsModel;
        this.#CampAmenitiesModel = CampAmenitiesModel;
        this.#EnvsModel = EnvsModel;
        this.#ThemesModel = ThemesModel;
        this.#BooksModel = BooksModel;
    }

    findBookListByPk = async (siteId, usingDays) => {
        return await this.#BooksModel.findAll({
            where: {
                [Op.and]: [
                    { siteId },
                    { confirmBook: true },
                    { expiredBooks: false },
                    { cancelBooks: false },
                    {
                        usingDays: { [Op.like]: '%' + usingDays + '%' },
                    },
                ],
            },
        });
    };

    findCampById = async (campId) => {
        return await this.#CampsModel.findOne({
            where: { campId },
        });
    };

    getSearchCampLists = async (
        search,
        types,
        themes,
        envs,
        amenities,
        location
    ) => {
        return await this.#CampsModel.findAll({
            where: {
                campName: { [Op.like]: '%' + search + '%' },
                campAddress: getLocationIncludecondition(location),
            },
            include: [
                {
                    where: getTypesIncludecondition(types),
                    model: this.#TypesModel,
                    as: 'Types',
                    attributes: ['typeLists'],
                },
                {
                    where: getCampAmenitiesIncludecondition(amenities),
                    model: this.#CampAmenitiesModel,
                    as: 'CampAmenities',
                    attributes: ['campAmenities'],
                },
                {
                    where: getEnvsIncludecondition(envs),
                    model: this.#EnvsModel,
                    as: 'Envs',
                    attributes: ['envLists'],
                },
                {
                    where: getThemesIncludecondition(themes),
                    model: this.#ThemesModel,
                    as: 'Themes',
                    attributes: ['themeLists'],
                },
                {
                    model: this.#ReviewsModel,
                    as: 'Reviews',
                    attributes: ['reviewId'],
                },
            ],
            order: [['likes', 'DESC']],
        });
    };

    getAllSites = async (campId) => {
        return await this.#SitesModel.findAll({
            where: { campId },
        });
    };
}

module.exports = SearchRepository;
