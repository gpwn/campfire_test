const express = require('express');
const router = express.Router();
const authHostMiddleware = require('../middlewares/authHost.middleware.js');
const authUserMiddleware = require('../middlewares/authUser.middleware.js');

const BooksController = require('../architecture/controllers/books.controller.js');
const booksController = new BooksController();

// 캠핑장 예약하기
router.post(
    '/:campId/:siteId',
    authUserMiddleware,
    booksController.addBookscamps
);

// 호스트 예약 목록 조회
router.get(
    '/hosts/checkbooks',
    authHostMiddleware,
    booksController.getBookListByHost
);

// 유저 예약 목록 조회
router.get(
    '/users/checkbooks',
    authUserMiddleware,
    booksController.getBookListByUser
);

// 호스트 예약 확정/확정 취소
router.put('/hosts/:bookId', authHostMiddleware, booksController.confirmByHost);

// 유저 예약 취소
router.put(
    '/users/:bookId',
    authUserMiddleware,
    booksController.cancelBookByUser
);

// 유저 예약 취소 캠핑장 리스트 조회
router.get(
    '/users/cancelBooks',
    authUserMiddleware,
    booksController.getCancelBooks
);

// 유저 이용 완료 캠핑장 리스트 조회
router.get(
    '/users/expiredBooks',
    authUserMiddleware,
    booksController.getExpiredBooks
);

module.exports = router;
