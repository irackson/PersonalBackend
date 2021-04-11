const Nav = require('../models/Nav');

const buildNav = async (currentPage) => {
    let navs = await Nav.find({});
    navs.sort((p1, p2) => p1.position - p2.position);
    navs = navs.filter((nav) => nav.name !== currentPage);

    return new Promise(function (myResolve) {
        myResolve(navs);
    });
};

module.exports = { buildNav };
