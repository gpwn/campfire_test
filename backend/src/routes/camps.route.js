const express = require('express');
const router = express.Router();
const { upload } = require('../modules/campImg.js');
const authHostMiddleware = require('../middlewares/authHost.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');
const likeConfirmUserHostMiddleware = require('../middlewares/likeConfirmUserHost.middleware');

const CampsController = require('../architecture/controllers/camps.controller.js');
const campsController = new CampsController();

// 캠핑장 등록
router.post(
    '/',
    upload.fields([
        { name: 'campMainImage', maxCount: 1 },
        { name: 'campSubImages', maxCount: 10 },
    ]),
    authHostMiddleware,
    campsController.createCamp
);
// 캠핑장 페이지 조회
router.get(
    '/page',
    likeConfirmUserHostMiddleware,
    campsController.getCampsByPage
);
// 캠핑장 상세 조회
router.get(
    '/:campId',
    likeConfirmUserHostMiddleware,
    campsController.getCampById
);
// 캠핑장 수정
router.patch(
    '/:campId',
    upload.fields([
        { name: 'campMainImage', maxCount: 1 },
        { name: 'campSubImages', maxCount: 10 },
    ]),
    authHostMiddleware,
    campsController.updateCamps
);
// 캠핑장 삭제
router.delete('/:campId', authHostMiddleware, campsController.deletecamps);
// 캠핑장 키워드 체크박스 수정
router.patch(
    '/:campId/keyword',
    authHostMiddleware,
    campsController.updateKeyword
);

module.exports = router;
