const formatDate = (date) => {
    date = date.toString().split(' ').slice(1, 4);
    return [].concat(date[0], date[1] + ',', date[2]).join(' ');
};

module.exports = {
    formatDate,
};
