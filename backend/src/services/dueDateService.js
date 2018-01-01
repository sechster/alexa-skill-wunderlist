const moment = require('moment');

module.exports.getDueDate = function getDueDate(dateString) {
    dateString = dateString.toLowerCase();

    if (dateString == "today") {
        return moment().toDate();
    } else if (dateString == "tomorrow") {
        return moment().add(1, 'd').toDate();
    }

    return moment().toDate();
}