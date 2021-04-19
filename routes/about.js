const { getNav } = require('../utils/nav');
const { isActive, isAuthorized } = require('../utils/auth');

//! create our new router
const router = require('express').Router();
const { pageDir, renderIndex } = require('../controllers/about');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/', isActive);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

//* RENDER ALL
router.get('/', renderIndex);

//! CATCHALL
router.get('/*', async (req, res) => {
    console.log('about catchall invoked');
    const page = await getNav(pageDir);
    res.redirect(`/${page.dir}`);
});
////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
