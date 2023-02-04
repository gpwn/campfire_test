const BooksRepository = require('../repositories/books.repository.js');
const CampsRepository = require('../repositories/camps.repository.js');
const SitesRepository = require('../repositories/sites.repository.js');
const {
    ValidationError,
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

const { Books, Camps, Hosts, Users, Sites } = require('../../models');
const { Op } = require('sequelize');
const { getDatesStartToLast } = require('../../modules/dateModule.js');

class BooksService {
    constructor() {
        this.booksRepository = new BooksRepository(
            Books,
            Camps,
            Hosts,
            Users,
            Sites
        );
        this.campsRepository = new CampsRepository(
            Books,
            Camps,
            Hosts,
            Users,
            Sites
        );
        this.sitesRepository = new SitesRepository(
            Books,
            Camps,
            Hosts,
            Users,
            Sites
        );
    }

    // 캠핑장 예약하기
    addBookscamps = async (
        campId,
        userId,
        siteId,
        checkInDate,
        checkOutDate,
        adults,
        children
    ) => {
        const findHostId = await this.campsRepository.findCampById(campId);
        if (!findHostId) {
            throw new ValidationError('예약할 수 없는 캠핑장입니다.', 400);
        }
        const hostId = findHostId.hostId;

        const checkCampBySiteId = await this.sitesRepository.findSiteById(
            campId,
            siteId
        );
        if (!checkCampBySiteId) {
            throw new ValidationError('예약할 수 없는 사이트입니다.', 400);
        }

        const totalPeople = Number(adults) + Number(children);

        let usingDays = getDatesStartToLast(checkInDate, checkOutDate);
        if (usingDays.length >= 7) {
            throw new InvalidParamsError(
                '7일 이상 예약은 호스트에서 문의하세요.',
                404
            );
        }
        if (usingDays.length === 0) {
            usingDays = checkInDate;
        }

        for (let i = 0; i < usingDays.length; i++) {
            const isExistBook = await this.booksRepository.findBookByPk({
                where: {
                    [Op.and]: [
                        { userId },
                        {
                            usingDays: { [Op.like]: '%' + usingDays[i] + '%' },
                        },
                        { cancelBooks: false },
                    ],
                },
            });

            if (isExistBook) {
                throw new InvalidParamsError(
                    '해당 날짜에 이미 예약된 내역이 있습니다.',
                    400
                );
            }
        }

        return await this.booksRepository.addBookscamps(
            campId,
            userId,
            hostId,
            siteId,
            checkInDate,
            checkOutDate,
            usingDays.toString(),
            adults,
            children,
            totalPeople
        );
    };

    //호스트 예약 리스트 조회
    getBookListByHost = async (hostId) => {
        const bookLists = await this.booksRepository.findBookListByPk({
            where: { hostId },
        });

        return bookLists.map((bookList) => {
            return {
                bookId: bookList.bookId,
                userId: bookList.userId,
                hostId: bookList.hostId,
                campId: bookList.campId,
                siteId: bookList.siteId,
                siteName: bookList['Site.siteName'],
                siteDesc: bookList['Site.siteDesc'],
                siteInfo: bookList['Site.siteInfo'],
                sitePrice: bookList['Site.sitePrice'],
                siteMainImage: bookList['Site.siteMainImage'],
                checkInDate: bookList.checkInDate,
                checkOutDate: bookList.checkOutDate,
                Camp_checkIn: bookList['Camp.checkIn'],
                Camp_checkOut: bookList['Camp.checkOut'],
                adults: bookList.adults,
                children: bookList.children,
                confirmBook: bookList.confirmBook === 0 ? false : true,
                createdAt: bookList.createdAt,
                updatedAt: bookList.updatedAt,
            };
        });
    };

    //유저 예약 리스트 조회
    getBookListByUser = async (userId) => {
        await this.booksRepository.updateCanselStatus(userId);
        await this.booksRepository.updateExpiredStatus(userId);

        const bookLists = await this.booksRepository.findBookListByPk({
            where: {
                [Op.and]: { userId, expiredBooks: false, cancelBooks: false },
            },
        });

        return bookLists.map((bookList) => {
            return {
                bookId: bookList.bookId,
                userId: bookList.userId,
                hostId: bookList.hostId,
                campId: bookList.campId,
                siteId: bookList.siteId,
                siteName: bookList['Site.siteName'],
                siteDesc: bookList['Site.siteDesc'],
                siteInfo: bookList['Site.siteInfo'],
                sitePrice: bookList['Site.sitePrice'],
                siteMainImage: bookList['Site.siteMainImage'],
                checkInDate: bookList.checkInDate,
                checkOutDate: bookList.checkOutDate,
                Camp_checkIn: bookList['Camp.checkIn'],
                Camp_checkOut: bookList['Camp.checkOut'],
                adults: bookList.adults,
                children: bookList.children,
                confirmBook: bookList.confirmBook === 0 ? false : true,
                createdAt: bookList.createdAt,
                updatedAt: bookList.updatedAt,
            };
        });
    };

    // 호스트 예약 확정/확정 취소
    confirmByHost = async (hostId, bookId) => {
        const book = await this.booksRepository.findBookByPk({
            where: {
                [Op.and]: [{ hostId, bookId }],
            },
        });

        if (book.cancelBooks === true) {
            throw new InvalidParamsError('이미 유저가 취소한 예약내역입니다.');
        }

        let confirmBook = book.confirmBook;
        let message = '';
        if (book.confirmBook === false) {
            confirmBook = true;
            message = '예약확정 성공!';
        } else {
            confirmBook = false;
            message = '예약확정 취소!';
        }

        await this.booksRepository.updateBookConfirmBook(bookId, confirmBook);

        return message;
    };

    // 유저 예약 취소
    cancelBookByUser = async (userId, bookId) => {
        const book = await this.booksRepository.findBookByPk({
            where: {
                [Op.and]: [{ userId, bookId }],
            },
        });

        const hostPhoneNumber = book.Host.phoneNumber;

        let message = '';
        let cancelBooks = book.cancelBooks;
        if (book.confirmBook === true) {
            cancelBooks = false;
            message = '예약 취소 할 수 없습니다. 호스트에게 문의하세요.';
        } else {
            cancelBooks = true;
            message = '예약을 취소하였습니다';
        }

        await this.booksRepository.updateBookCancelBook(bookId, cancelBooks);

        return { message, hostPhoneNumber };
    };

    // 유저 예약 취소 캠핑장 리스트 조회
    getCancelBooks = async (userId) => {
        const cancelBookLists = await this.booksRepository.findBookListByPk({
            where: {
                [Op.and]: [{ userId, cancelBooks: true }],
            },
        });

        return cancelBookLists.map((cancelBookList) => {
            return {
                bookId: cancelBookList.bookId,
                userId: cancelBookList.userId,
                hostId: cancelBookList.hostId,
                campId: cancelBookList.campId,
                siteId: cancelBookList.siteId,
                siteName: cancelBookList['Site.siteName'],
                siteDesc: cancelBookList['Site.siteDesc'],
                siteInfo: cancelBookList['Site.siteInfo'],
                sitePrice: cancelBookList['Site.sitePrice'],
                siteMainImage: cancelBookList['Site.siteMainImage'],
                checkInDate: cancelBookList.checkInDate,
                checkOutDate: cancelBookList.checkOutDate,
                Camp_checkIn: cancelBookList['Camp.checkIn'],
                Camp_checkOut: cancelBookList['Camp.checkOut'],
                adults: cancelBookList.adults,
                children: cancelBookList.children,
                cancelBooks: cancelBookList.cancelBooks === 0 ? false : true,
                createdAt: cancelBookList.createdAt,
                updatedAt: cancelBookList.updatedAt,
            };
        });
    };

    // 유저 이용 완료 캠핑장 리스트 조회
    getExpiredBooks = async (userId) => {
        const expiredBookLists = await this.booksRepository.findBookListByPk({
            where: {
                [Op.and]: [{ userId, expiredBooks: true }],
            },
        });

        return expiredBookLists.map((expiredBookList) => {
            return {
                bookId: expiredBookList.bookId,
                userId: expiredBookList.userId,
                hostId: expiredBookList.hostId,
                campId: expiredBookList.campId,
                siteId: expiredBookList.siteId,
                siteName: expiredBookList['Site.siteName'],
                siteDesc: expiredBookList['Site.siteDesc'],
                siteInfo: expiredBookList['Site.siteInfo'],
                sitePrice: expiredBookList['Site.sitePrice'],
                siteMainImage: expiredBookList['Site.siteMainImage'],
                checkInDate: expiredBookList.checkInDate,
                checkOutDate: expiredBookList.checkOutDate,
                Camp_checkIn: expiredBookList['Camp.checkIn'],
                Camp_checkOut: expiredBookList['Camp.checkOut'],
                adults: expiredBookList.adults,
                children: expiredBookList.children,
                expiredBooks: expiredBookList.expiredBooks === 0 ? false : true,
                createdAt: expiredBookList.createdAt,
                updatedAt: expiredBookList.updatedAt,
            };
        });
    };
}

module.exports = BooksService;
