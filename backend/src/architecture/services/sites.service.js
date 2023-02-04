const SitesRepository = require('../repositories/sites.repository.js');
const CampsRepository = require('../repositories/camps.repository.js');
const {
    ValidationError,
    InvalidParamsError,
    ExistError,
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
const { deleteImage } = require('../../modules/campImg');
const {
    getMainImageName,
    getSubImagesNames,
} = require('../../modules/modules.js');

class SitesService {
    constructor() {
        this.sitesRepository = new SitesRepository(
            Books,
            Camps,
            Hosts,
            Users,
            Sites,
            CampAmenities,
            Envs,
            Types,
            Themes
        );
        this.campsRepository = new CampsRepository(
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
            Reviews
        );
    }
    // 캠핑장 사이트 등록
    createSite = async (
        hostId,
        campId,
        siteMainImage,
        siteSubImages,
        siteName,
        siteInfo,
        siteDesc,
        sitePrice,
        minPeople,
        maxPeople,
        roomCount
    ) => {
        const isExistValue = await this.sitesRepository.getIsExistValue(
            siteName
        );
        if (isExistValue) {
            throw new ExistError();
        }
        const createdSite = await this.sitesRepository.createSite(
            hostId,
            campId,
            siteMainImage,
            siteSubImages,
            siteName,
            siteInfo,
            siteDesc,
            sitePrice,
            minPeople,
            maxPeople,
            roomCount
        );
        if (!createdSite) {
            throw new ValidationError(
                '캠핑장 사이트 등록에 실패하였습니다.',
                400
            );
        }
        return createdSite;
    };
    // 캠핑장 사이트 수정
    updateSite = async (
        hostId,
        campId,
        siteId,
        siteMainImage,
        siteSubImages,
        siteName,
        siteInfo,
        siteDesc,
        sitePrice,
        minPeople,
        maxPeople,
        roomCount
    ) => {
        const findSite = await this.sitesRepository.findSiteById(
            campId,
            siteId
        );
        if (!findSite) {
            throw new InvalidParamsError(
                '캠핑장 사이트를 찾을 수 없습니다',
                404
            );
        }

        if (findSite.hostId !== hostId) {
            throw new ValidationError(
                '캠핑장 사이트 수정 권한이 없습니다.',
                400
            );
        }

        const siteMainImageName = getMainImageName(findSite['siteMainImage']);
        const siteSubImageNames = getSubImagesNames(findSite['siteSubImages']);

        await deleteImage(siteMainImageName);
        for (let siteSubImageName of siteSubImageNames) {
            await deleteImage(siteSubImageName);
        }

        return await this.sitesRepository.updateSite(
            hostId,
            campId,
            siteId,
            siteMainImage,
            siteSubImages,
            siteName,
            siteInfo,
            siteDesc,
            sitePrice,
            minPeople,
            maxPeople,
            roomCount
        );
    };

    // 캠핑장 사이트 삭제
    deleteSite = async (campId, siteId, hostId) => {
        const findSite = await this.sitesRepository.findSiteById(
            campId,
            siteId
        );
        if (!findSite) {
            throw new InvalidParamsError(
                '캠핑장 사이트를 찾을 수 없습니다',
                404
            );
        }

        if (findSite.hostId !== hostId) {
            throw new ValidationError('캠핑장 삭제 권한이 없습니다.', 400);
        }
        const siteMainImageName = getMainImageName(findSite['siteMainImage']);
        const siteSubImageNames = getSubImagesNames(findSite['siteSubImages']);

        await deleteImage(siteMainImageName);
        for (let siteSubImageName of siteSubImageNames) {
            await deleteImage(siteSubImageName);
        }

        await this.sitesRepository.deleteSite(campId, siteId, hostId);
    };

    //캠핑장 사이트 목록 조회
    getSiteLists = async (campId) => {
        const camp = await this.campsRepository.findCampById(campId);
        if (!camp) {
            throw new InvalidParamsError('존재하지 않는 캠핑장입니다.', 404);
        }

        return await this.sitesRepository.getSiteLists(campId);
    };

    //캠핑장 사이트 상세 조회
    getsiteById = async (campId, siteId) => {
        const camp = await this.campsRepository.findCampById(campId);
        if (!camp) {
            throw new InvalidParamsError('존재하지 않는 캠핑장입니다.', 404);
        }

        const site = await this.sitesRepository.getsiteById(campId, siteId);
        if (!site) {
            throw new InvalidParamsError(
                '존재하지 않는 캠핑장 사이트입니다.',
                404
            );
        }
        const { typeLists } = await this.campsRepository.findtypeList(campId);

        return {
            siteId: site.siteId,
            campId: site.campId,
            hostId: site.hostId,
            siteName: site.siteName,
            siteInfo: site.siteInfo,
            siteDesc: site.siteDesc,
            sitePrice: site.sitePrice,
            siteMainImage: site.siteMainImage,
            siteSubImages: site.siteSubImages.split(','),
            minPeople: site.minPeople,
            maxPeople: site.maxPeople,
            roomCount: site.roomCount,
            checkIn: site.Camp.checkIn,
            checkOut: site.Camp.checkOut,
            typeLists: typeLists === null ? null : typeLists.split(','),
            createdAt: site.createdAt,
            updatedAt: site.updatedAt,
        };
    };
}

module.exports = SitesService;
