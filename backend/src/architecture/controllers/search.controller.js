const SearchService = require('../services/search.service.js');
const {
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');
const { getDatesStartToLast } = require('../../modules/dateModule.js');

class SearchController {
    constructor() {
        this.searchService = new SearchService();
    }

    // 캠핑장 조건 검색
    getSearchCampLists = async (req, res, next) => {
        try {
            let userId = 0;
            if (res.locals.userId === undefined) {
                userId = 0;
            } else {
                userId = res.locals.userId;
            }

            const searchInfo = req.query;
            const search = searchInfo.search;
            let types = searchInfo.types;
            let themes = searchInfo.themes;
            let envs = searchInfo.envs;
            let amenities = searchInfo.amenities;
            const location = searchInfo.location;

            if (!searchInfo) {
                throw new InvalidParamsError();
            }

            if (types === '') {
                types = [];
            } else {
                types = types.split(',');
            }

            if (themes !== '') {
                themes = themes.split(',');
            } else {
                themes = [];
            }

            if (envs !== '') {
                envs = envs.split(',');
            } else {
                envs = [];
            }

            if (amenities !== '') {
                amenities = amenities.split(',');
            } else {
                amenities = [];
            }

            const getCampLists = await this.searchService.getSearchCampLists(
                userId,
                search,
                types,
                themes,
                envs,
                amenities,
                location
            );

            res.status(201).json({
                getCampLists,
            });
        } catch (error) {
            next(error);
        }
    };

    // 사이트 조건 검색
    getSearchSiteLists = async (req, res, next) => {
        try {
            const sitesInfo = req.query;
            if (!sitesInfo) {
                throw new InvalidParamsError();
            }

            const campId = sitesInfo.campid;
            const adults = sitesInfo.adults;
            const children = sitesInfo.children;
            const checkInDate = sitesInfo.checkindate;
            const checkOutDate = sitesInfo.checkoutdate;
            let usingDays = getDatesStartToLast(checkInDate, checkOutDate);

            if (usingDays.length === 0) {
                usingDays = checkInDate;
            }

            const getSiteLists = await this.searchService.getSearchSiteLists(
                campId,
                adults,
                children,
                usingDays
            );

            res.status(201).json({
                getSiteLists,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = SearchController;
