const SearchRepository = require('../repositories/search.repository.js');
const LikesRepository = require('../repositories/likes.repository.js');
const {
    Books,
    Camps,
    Users,
    Sites,
    CampAmenities,
    Envs,
    Types,
    Themes,
    Likes,
    Reviews,
} = require('../../models');
const {
    ValidationError,
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

class SearchService {
    constructor() {
        this.searchRepository = new SearchRepository(
            Camps,
            Sites,
            Types,
            Reviews,
            CampAmenities,
            Envs,
            Themes,
            Books
        );
        this.likesRepository = new LikesRepository(Camps, Users, Likes);
    }

    getSearchCampLists = async (
        userId,
        search,
        types,
        themes,
        envs,
        amenities
    ) => {
        if (
            types.length > 3 ||
            themes.length > 3 ||
            envs.length > 3 ||
            amenities.length > 3
        ) {
            throw new ValidationError(
                '카테고리는 3개까지만 선택할 수 있습니다.',
                400
            );
        }
        const searchLists = await this.searchRepository.getSearchCampLists(
            search,
            types,
            themes,
            envs,
            amenities
        );

        return await Promise.all(
            searchLists.map(async (searchList) => {
                const findLike = await this.likesRepository.isExistLike(
                    searchList.campId,
                    userId
                );
                let likeStatus = false;
                if (findLike) {
                    likeStatus = true;
                } else {
                    likeStatus = false;
                }
                return {
                    campId: searchList.campId,
                    hostId: searchList.hostId,
                    campName: searchList.campName,
                    campAddress: searchList.campAddress,
                    campMainImage: searchList.campMainImage,
                    campDesc: searchList.campDesc,
                    typeLists:
                        searchList.Types[0].typeLists === null
                            ? null
                            : searchList.Types[0].typeLists.split(','),
                    likes: searchList.likes,
                    likeStatus: likeStatus,
                    mapX: searchList.mapX,
                    mapY: searchList.mapY,
                    premium: searchList.premium,
                    countReviews: searchList.Reviews.length,
                    createdAt: searchList.createdAt,
                    updatedAt: searchList.updatedAt,
                };
            })
        );
    };

    getSearchSiteLists = async (campId, adults, children, usingDays) => {
        const findCamp = await this.searchRepository.findCampById(campId);
        if (!findCamp) {
            throw new InvalidParamsError('존재하지 않는 캠핑장입니다.', 404);
        }

        const getAllSites = await this.searchRepository.getAllSites(campId);

        return await Promise.all(
            getAllSites.map(async (site) => {
                let findMaxValue = [];
                for (let usingDay of usingDays) {
                    const findBookBySearch =
                        await this.searchRepository.findBookListByPk(
                            site.siteId,
                            usingDay
                        );
                    findMaxValue.push(findBookBySearch.length);
                }
                const maxValue = Math.max(...findMaxValue);

                const amount = Number(adults) + Number(children);

                let bookStatus = false;
                if (
                    site.roomCount > maxValue &&
                    site.maxPeople >= amount &&
                    site.minPeople <= amount
                ) {
                    bookStatus = true;
                } else {
                    bookStatus = false;
                }
                return {
                    siteId: site.siteId,
                    campId: site.campId,
                    siteName: site.siteName,
                    sitePrice: site.sitePrice,
                    siteMainImage: site.siteMainImage,
                    bookStatus: bookStatus,
                    minPeople: site.minPeople,
                    maxPeople: site.maxPeople,
                    createdAt: site.createdAt,
                    updatedAt: site.updatedAt,
                };
            })
        );
    };
}

module.exports = SearchService;
