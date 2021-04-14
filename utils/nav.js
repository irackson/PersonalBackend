const Nav = require('../models/Nav');

const buildNavbar = async (admin) => {
    let navs = await Nav.find({});
    navs.sort((p1, p2) => p1.position - p2.position);
    if (!admin) {
        navs = navs.filter((nav) => nav.visible);
    }

    return new Promise(function (myResolve) {
        myResolve(navs);
    });
};

const getNav = async (currentPageName) => {
    const page = await Nav.findOne({ name: currentPageName });
    return new Promise(function (myResolve) {
        myResolve(page);
    });
};

module.exports = { buildNavbar, getNav };
