const express = require('express');
const router = express.Router();
const { upload } = require('../modules/campImg.js');
const authHostMiddleware = require('../middlewares/authHost.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');

const SitesController = require('../architecture/controllers/sites.controller.js');
const sitesController = new SitesController();

// 캠핑장 사이트 업로드
router.post(
    '/:campId/sites',
    upload.fields([
        { name: 'siteMainImage', maxCount: 1 },
        { name: 'siteSubImages', maxCount: 10 },
    ]),
    authHostMiddleware,
    sitesController.createSite
);
// 캠핑장 사이트 수정
router.put(
    '/:campId/sites/:siteId',
    upload.fields([
        { name: 'siteMainImage', maxCount: 1 },
        { name: 'siteSubImages', maxCount: 10 },
    ]),
    authHostMiddleware,
    sitesController.updateSite
);
// 캠핑장 사이트 삭제
router.delete(
    '/:campId/sites/:siteId',
    authHostMiddleware,
    sitesController.deleteSite
);

//캠핑장 사이트 목록 조회
router.get('/:campId/sites', sitesController.getSiteLists);

//캠핑장 사이트 상세 조회
router.get('/:campId/sites/:siteId', sitesController.getsiteById);

module.exports = router;
