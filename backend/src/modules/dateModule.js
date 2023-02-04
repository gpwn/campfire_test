const {
    InvalidParamsError,
} = require('../middlewares/exceptions/error.class.js');

function getDatesStartToLast(startDate, lastDate) {
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (!(regex.test(startDate) && regex.test(lastDate)))
        return 'Not Date Format';
    var result = [];
    var curDate = new Date(startDate);
    while (curDate < new Date(lastDate)) {
        result.push(curDate.toISOString().split('T')[0]);
        curDate.setDate(curDate.getDate() + 1);
    }
    return result;
}

function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ('0' + (1 + date.getMonth())).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

module.exports = {
    getDatesStartToLast,
    getToday,
};
