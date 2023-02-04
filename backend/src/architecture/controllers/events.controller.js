const EventsService = require('../services/events.service.js');

class EventsController {
    constructor() {
        this.eventsService = new EventsService();
    }
    //프리미엄 캠핑장 조회
    getPremiumCamps = async (req, res, next) => {
        try {
            let userId = 0;
            if (res.locals.userId === undefined) {
                userId = 0;
            } else {
                userId = res.locals.userId;
            }
            const premium = await this.eventsService.getPremiumCamps(userId);
            res.status(200).json({ premium });
        } catch (error) {
            next(error);
        }
    };
    //찜하기 순 캠핑장
    getLikesCamps = async (req, res, next) => {
        try {
            const likes = await this.eventsService.getLikesCamps();
            res.status(200).json({ likes });
        } catch (error) {
            next(error);
        }
    };
    //리뷰 순 캠핑장
    getReviewsCamps = async (req, res, next) => {
        try {
            const reviews = await this.eventsService.getReviewsCamps();
            res.status(200).json({ reviews });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = EventsController;
