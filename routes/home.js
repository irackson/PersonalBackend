const { buildNavbar, getNav } = require('../utils/nav');
const { isAuthorized } = require('../utils/auth');

//! import router
const router = require('express').Router();
const WebmasterRouter = require('./webmaster');
const UsersRouter = require('./users');
const BlogRouter = require('./blog');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/webmaster', WebmasterRouter);
router.use('/blog', BlogRouter);
router.use('/users', UsersRouter);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////
const pageName = 'home';

router.get('/', async (req, res) => {
    const page = await getNav(pageName);
    const pages = await buildNavbar(req.session.admin);
    res.render('home', {
        page,
        pages,
    });
});

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
