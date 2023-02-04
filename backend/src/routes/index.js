const express = require('express');
const router = express.Router();

router.use('/users', require('./users.route.js'));
router.use('/hosts', require('./hosts.route.js'));
router.use('/camps', require('./camps.route.js'));
router.use('/books', require('./books.route.js'));
router.use('/auths', require('./auths.routes.js'));
router.use('/camps', require('./sites.route.js'));
router.use('/likes', require('./likes.route.js'));
router.use('/camps', require('./reviews.route.js'));
router.use('/search', require('./search.route.js'));
router.use('/events', require('./events.route.js'));

router.get('/', (req, res) => {
    res.send('api index route 연결 성공!!!');
});

module.exports = router;
