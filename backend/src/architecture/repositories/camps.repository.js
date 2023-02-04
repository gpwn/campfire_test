const { Op } = require('sequelize');
const { sequelize } = require('../../models');

class CampsRepository {
    #BooksModel;
    #CampsModel;
    #HostsModel;
    #UsersModel;
    #SitesModel;
    #CampAmenitiesModel;
    #EnvsModel;
    #TypesModel;
    #ThemesModel;
    #LikesModel;
    #ReviewsModel;
    constructor(
        BooksModel,
        CampsModel,
        HostsModel,
        UsersModel,
        SitesModel,
        CampAmenitiesModel,
        EnvsModel,
        TypesModel,
        ThemesModel,
        LikesModel,
        ReviewsModel
    ) {
        this.#BooksModel = BooksModel;
        this.#CampsModel = CampsModel;
        this.#HostsModel = HostsModel;
        this.#UsersModel = UsersModel;
        this.#SitesModel = SitesModel;
        this.#CampAmenitiesModel = CampAmenitiesModel;
        this.#EnvsModel = EnvsModel;
        this.#TypesModel = TypesModel;
        this.#ThemesModel = ThemesModel;
        this.#LikesModel = LikesModel;
        this.#ReviewsModel = ReviewsModel;
    }

    // 캠핑장 업로드
    createCamp = async (
        hostId,
        campMainImage,
        campSubImages,
        campName,
        campAddress,
        campDesc,
        checkIn,
        checkOut,
        mapX,
        mapY
    ) => {
        const createdCamp = await this.#CampsModel.create({
            hostId,
            campMainImage,
            campSubImages,
            campName,
            campAddress,
            campDesc,
            checkIn,
            checkOut,
            mapX,
            mapY,
        });
        const { campId } = createdCamp;
        await this.#CampAmenitiesModel.create({
            campId,
            campAmenities: null,
        });
        await this.#EnvsModel.create({
            campId,
            envLists: null,
        });
        await this.#TypesModel.create({
            campId,
            typeLists: null,
        });
        await this.#ThemesModel.create({
            campId,
            themeLists: null,
        });
        return createdCamp;
    };

    // 캠핑장 중복값 조회
    getIsExistValue = async (campName, campAddress) => {
        const camp = await this.#CampsModel.findOne({
            where: { [Op.or]: [{ campName }, { campAddress }] },
        });
        return camp;
    };

    // 캠핑장 수정하기
    updateCamps = async (
        campId,
        hostId,
        campName,
        campAddress,
        campMainImage,
        campSubImages,
        campDesc,
        checkIn,
        checkOut,
        mapX,
        mapY
    ) => {
        return await this.#CampsModel.update(
            {
                campId,
                hostId,
                campName,
                campAddress,
                campMainImage,
                campSubImages,
                campDesc,
                checkIn,
                checkOut,
                mapX,
                mapY,
            },
            {
                where: {
                    [Op.and]: [{ campId, hostId }],
                },
            }
        );
    };

    // 캠핑장 삭제하기
    deletecamps = async (campId, hostId) => {
        await this.#CampsModel.destroy({
            where: {
                [Op.and]: [{ campId, hostId }],
            },
        });
    };

    // 캠핑장 키워드 체크박스 수정
    updateKeyword = async (
        campId,
        campAmenities,
        envLists,
        typeLists,
        themeLists
    ) => {
        if (campAmenities !== null) {
            await this.#CampAmenitiesModel.update(
                {
                    campAmenities,
                },
                { where: { campId } }
            );
        }
        if (envLists !== null) {
            await this.#EnvsModel.update(
                {
                    envLists,
                },
                { where: { campId } }
            );
        }
        if (typeLists !== null) {
            await this.#TypesModel.update(
                {
                    typeLists,
                },
                { where: { campId } }
            );
        }
        if (themeLists !== null) {
            await this.#ThemesModel.update(
                {
                    themeLists,
                },
                { where: { campId } }
            );
        }
    };

    // 캠핑장 페이지 조회
    getCampsByPage = async (pageNo) => {
        const camps = await this.#CampsModel.findAll({
            offset: pageNo,
            limit: 16,
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
            order: [
                ['premium', 'DESC'],
                ['hostId', 'ASC'],
            ],
        });
        if (camps.length === 0) {
            return false;
        } else {
            return camps;
        }
    };

    // 캠핑장 상세 조회
    findCampById = async (campId) => {
        return await this.#CampsModel.findOne({
            where: { campId },
            include: [{ model: this.#HostsModel, attributes: ['phoneNumber'] }],
        });
    };

    findAmenities = async (campId) => {
        return await this.#CampAmenitiesModel.findOne({
            where: { campId },
        });
    };

    findEnvLists = async (campId) => {
        return await this.#EnvsModel.findOne({
            where: { campId },
        });
    };

    findtypeList = async (campId) => {
        return await this.#TypesModel.findOne({
            where: { campId },
        });
    };

    findThemeLists = async (campId) => {
        return await this.#ThemesModel.findOne({
            where: { campId },
        });
    };
}

module.exports = CampsRepository;
