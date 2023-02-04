const { Op } = require('sequelize');

const getTypesIncludecondition = function (Array) {
    if (Array.length === 0) {
        return null;
    } else if (Array.length === 1) {
        return { typeLists: { [Op.like]: '%' + Array + '%' } };
    } else if (Array.length === 2) {
        return {
            [Op.and]: [
                { typeLists: { [Op.like]: '%' + Array[0] + '%' } },
                { typeLists: { [Op.like]: '%' + Array[1] + '%' } },
            ],
        };
    } else if (Array.length === 3) {
        return {
            [Op.and]: [
                { typeLists: { [Op.like]: '%' + Array[0] + '%' } },
                { typeLists: { [Op.like]: '%' + Array[1] + '%' } },
                { typeLists: { [Op.like]: '%' + Array[2] + '%' } },
            ],
        };
    }
};
const getCampAmenitiesIncludecondition = function (Array) {
    if (Array.length === 0) {
        return null;
    } else if (Array.length === 1) {
        return { campAmenities: { [Op.like]: '%' + Array + '%' } };
    } else if (Array.length === 2) {
        return {
            [Op.and]: [
                { campAmenities: { [Op.like]: '%' + Array[0] + '%' } },
                { campAmenities: { [Op.like]: '%' + Array[1] + '%' } },
            ],
        };
    } else if (Array.length === 3) {
        return {
            [Op.and]: [
                { campAmenities: { [Op.like]: '%' + Array[0] + '%' } },
                { campAmenities: { [Op.like]: '%' + Array[1] + '%' } },
                { campAmenities: { [Op.like]: '%' + Array[2] + '%' } },
            ],
        };
    }
};
const getEnvsIncludecondition = function (Array) {
    if (Array.length === 0) {
        return null;
    } else if (Array.length === 1) {
        return { envLists: { [Op.like]: '%' + Array + '%' } };
    } else if (Array.length === 2) {
        return {
            [Op.and]: [
                { envLists: { [Op.like]: '%' + Array[0] + '%' } },
                { envLists: { [Op.like]: '%' + Array[1] + '%' } },
            ],
        };
    } else if (Array.length === 3) {
        return {
            [Op.and]: [
                { envLists: { [Op.like]: '%' + Array[0] + '%' } },
                { envLists: { [Op.like]: '%' + Array[1] + '%' } },
                { envLists: { [Op.like]: '%' + Array[2] + '%' } },
            ],
        };
    }
};
const getThemesIncludecondition = function (Array) {
    if (Array.length === 0) {
        return null;
    } else if (Array.length === 1) {
        return { themeLists: { [Op.like]: '%' + Array + '%' } };
    } else if (Array.length === 2) {
        return {
            [Op.and]: [
                { themeLists: { [Op.like]: '%' + Array[0] + '%' } },
                { themeLists: { [Op.like]: '%' + Array[1] + '%' } },
            ],
        };
    } else if (Array.length === 3) {
        return {
            [Op.and]: [
                { themeLists: { [Op.like]: '%' + Array[0] + '%' } },
                { themeLists: { [Op.like]: '%' + Array[1] + '%' } },
                { themeLists: { [Op.like]: '%' + Array[2] + '%' } },
            ],
        };
    }
};
const getLocationIncludecondition = function (str) {
    if (str.length === 0) {
        return { [Op.like]: '%' + ' ' + '%' };
    } else if (str.length === 2) {
        return { [Op.like]: '%' + str + '%' };
    } else if (str.length === 3) {
        const str2 = str[0] + str[1];
        return {
            [Op.like]: '%' + str2 + '%',
        };
    } else if (str.length === 4) {
        const str2 = str[0] + str[2];
        return {
            [Op.or]: [
                { [Op.like]: '%' + str + '%' },
                { [Op.like]: '%' + str2 + '%' },
            ],
        };
    }
};

module.exports = {
    getTypesIncludecondition,
    getCampAmenitiesIncludecondition,
    getEnvsIncludecondition,
    getThemesIncludecondition,
    getLocationIncludecondition,
};
