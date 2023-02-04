const getMainImageName = function (imageDir) {
    return imageDir.split('/')[4];
};

const getSubImagesNames = function (imageDir) {
    console.log(imageDir);
    let subImages = imageDir.split(',');
    console.log(subImages);
    let subImageNames = [];
    for (let subImage of subImages) {
        subImageNames.push(subImage.split('/')[4]);
    }
    return subImageNames;
};

module.exports = { getMainImageName, getSubImagesNames };
