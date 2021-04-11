//! import router
const router = require('express').Router();
const UsersRouter = require('./users');
const { buildNav } = require('../utils/nav');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/users', UsersRouter);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

router.get('/', async (req, res) => {
    const pageName = 'home';
    const pageList = await buildNav(pageName);
    res.render('home', {
        pageName: pageName.toUpperCase(),
        pages: pageList,
    });
});

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
