const { buildNavbar, getNav } = require('../utils/nav');

//! import router
const router = require('express').Router();
const UsersRouter = require('./users');
const BlogRouter = require('./blog');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/blog', BlogRouter);
router.use('/users', UsersRouter);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////
const pageName = 'home';

router.get('/', async (req, res) => {
    const page = await getNav(pageName);
    const pages = await buildNavbar(pageName);
    res.render('home', {
        page,
        pages,
    });
});

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
