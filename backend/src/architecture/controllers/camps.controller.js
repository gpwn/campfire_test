const CampsService = require('../services/camps.service.js');
const {
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');

class CampsController {
    constructor() {
        this.campsService = new CampsService();
    }
    // 캠핑장 업로드
    createCamp = async (req, res, next) => {
        try {
            const {
                campName,
                campAddress,
                campDesc,
                checkIn,
                checkOut,
                mapX,
                mapY,
            } = req.body;

            const { hostId } = res.locals;
            let campMainImage;
            const campSubImagesArray = [];
            if (req.files) {
                campMainImage = req.files.campMainImage[0].location;
                for (const img of req.files.campSubImages) {
                    campSubImagesArray.push(img.location);
                }
            } else {
                throw new InvalidParamsError();
            }

            const campSubImages = campSubImagesArray.toString();
            if (
                !campName ||
                !campAddress ||
                !campDesc ||
                !checkIn ||
                !checkOut ||
                !mapX ||
                !mapY
            ) {
                throw new InvalidParamsError();
            }
            const { campId } = await this.campsService.createCamp(
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
            );
            res.status(201).json({
                message: '캠핑장이 등록되었습니다.',
                campId: campId,
            });
        } catch (error) {
            next(error);
        }
    };
    // 캠핑장 수정
    updateCamps = async (req, res, next) => {
        try {
            const {
                campName,
                campAddress,
                campDesc,
                checkIn,
                checkOut,
                mapX,
                mapY,
            } = req.body;

            const { hostId } = res.locals;
            const { campId } = req.params;

            let campMainImage;
            const campSubImagesArray = [];

            if (req.files) {
                campMainImage = req.files.campMainImage[0].location;
                for (const img of req.files.campSubImages) {
                    campSubImagesArray.push(img.location);
                }
            } else {
                throw new InvalidParamsError();
            }
            const campSubImages = campSubImagesArray.toString();

            await this.campsService.updateCamps(
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
            );

            res.status(201).json({
                message: '캠핑장이 수정되었습니다.',
                campId: campId,
            });
        } catch (error) {
            next(error);
        }
    };

    // 캠핑장 삭제
    deletecamps = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { hostId } = res.locals;

            await this.campsService.deletecamps(campId, hostId);

            res.status(201).json({
                message: '캠핑장이 삭제되었습니다.',
            });
        } catch (error) {
            next(error);
        }
    };
    // 캠핑장 페이지 조회
    getCampsByPage = async (req, res, next) => {
        try {
            const pageInfo = req.query;
            const pageNo = pageInfo.pageno;
            if (!pageInfo) {
                throw new InvalidParamsError();
            }
            let userId = 0;
            if (res.locals.userId === undefined) {
                userId = 0;
            } else {
                userId = res.locals.userId;
            }
            const camps = await this.campsService.getCampsByPage(
                pageNo,
                userId
            );
            res.status(200).json({ camps: camps });
        } catch (error) {
            next(error);
        }
    };

    // 캠핑장 상세 조회
    getCampById = async (req, res, next) => {
        try {
            const { campId } = req.params;

            let userId = 0;
            if (res.locals.userId === undefined) {
                userId = 0;
            } else {
                userId = res.locals.userId;
            }

            const camp = await this.campsService.findCampById(campId, userId);

            res.status(200).json({ camp: camp });
        } catch (error) {
            next(error);
        }
    };

    // 캠핑장 키워드 체크박스 수정
    updateKeyword = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const campAmenitiesArray =
                req.body.campAmenities === undefined
                    ? null
                    : req.body.campAmenities;
            const envListsArray =
                req.body.envLists === undefined ? null : req.body.envLists;
            const typeListsArray =
                req.body.typeLists === undefined ? null : req.body.typeLists;
            const themeListsArray =
                req.body.themeLists === undefined ? null : req.body.themeLists;

            const campAmenities =
                campAmenitiesArray === null
                    ? null
                    : campAmenitiesArray.toString();
            const envLists =
                envListsArray === null ? null : envListsArray.toString();
            const typeLists =
                typeListsArray === null ? null : typeListsArray.toString();
            const themeLists =
                themeListsArray === null ? null : themeListsArray.toString();

            await this.campsService.updateKeyword(
                campId,
                campAmenities,
                envLists,
                typeLists,
                themeLists
            );
            res.status(201).json({
                message: '캠핑장 키워드가 수정되었습니다.',
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = CampsController;
