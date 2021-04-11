//! import router
const router = require('express').Router();
const UsersRouter = require('./users');
const { buildNav } = require('../modules/nav-builder');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/users', UsersRouter);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

router.get('/', async (req, res) => {
    const pageList = await buildNav('home');
    res.render('home', {
        pages: pageList,
    });
});

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
