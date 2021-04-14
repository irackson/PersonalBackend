const { getNav } = require('../utils/nav');
const { isActive, isAuthorized } = require('../utils/auth');

//! create our new router
const router = require('express').Router();
const {
    pageDir,
    renderIndex,
    renderCreate,
    renderShow,
    renderUpdate,
    processCreate,
    processUpdate,
    processToggle,
    processDestroy,
} = require('../controllers/projects');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/', isActive);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

//* RENDER ALL
router.get('/', renderIndex);

//* RENDER CREATE
router.get('/create', isAuthorized, renderCreate);

//* RENDER ONE
router.get('/:slug', renderShow);

//* PROCESS CREATE
router.post('/', isAuthorized, processCreate);

//* RENDER UPDATE
router.get('/:slug/update', isAuthorized, renderUpdate);

//* PROCESS UPDATE
router.put('/:slug', isAuthorized, processUpdate);

//* PROCESS TOGGLE
router.patch('/:id', isAuthorized, processToggle);

//* PROCESS DESTROY
router.delete('/:slug', isAuthorized, processDestroy);

//! CATCHALL
router.get('/*', async (req, res) => {
    console.log('projects catchall invoked');
    const page = await getNav(pageDir);
    res.redirect(`/${page.dir}`);
});
////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
