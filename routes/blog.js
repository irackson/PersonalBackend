const { getNav } = require('../utils/nav');

//! create our new router
const router = require('express').Router();
const {
    pageName,
    renderIndex,
    renderCreate,
    renderShow,
    renderUpdate,
    processCreate,
    processUpdate,
    processToggle,
    processDestroy,
} = require('../controllers/blog');
const { isAuthorized } = require('../utils/auth');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

//* RENDER ALL
router.get('/', renderIndex);

//* RENDER ONE
router.get('/:slug', renderShow);

//* RENDER CREATE
router.get('/create', isAuthorized, renderCreate);

//* PROCESS CREATE
router.post('/', isAuthorized, processCreate);

//* RENDER UPDATE
router.get('/:slug/update', isAuthorized, renderUpdate);

//* PROCESS UPDATE
router.put('/:slug', isAuthorized, processUpdate);

//* PROCESS TOGGLE
router.patch('/:slug', isAuthorized, processToggle);

//* PROCESS DESTROY
router.delete('/:slug', isAuthorized, processDestroy);

//! CATCHALL
router.get('/*', async (req, res) => {
    console.log('blog catchall invoked');
    const page = await getNav(pageName);
    res.redirect(`/${page.dir}`);
});
////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
