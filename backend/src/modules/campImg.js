const multer = require('multer');
const multerS3 = require('multer-s3');
const { ValidationError } = require('../middlewares/exceptions/error.class.js');
const aws = require('aws-sdk');
require('dotenv').config();
aws.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});
const s3 = new aws.S3();

const deleteImage = async function (imageName) {
    try {
        console.log(imageName);
        console.log(',');
        await s3.deleteObject(
            {
                Bucket: process.env.POSTIMG_BUCKETNAME,
                Key: imageName,
            },
            (err, data) => {}
        );
    } catch (error) {
        return new ValidationError(
            '이미지 파일을 삭제하지 못했습니다.',
            'ImageDeleteError',
            400
        );
    }
};

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.POSTIMG_BUCKETNAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});

module.exports = { upload, deleteImage };
