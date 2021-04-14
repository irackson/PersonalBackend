const { getNav } = require('../utils/nav');

//! create our new router
const router = require('express').Router();
const {
    pageDir,
    renderUpdate,
    processUpdate,
    processCreate,
} = require('../controllers/webmaster');
const { isAuthorized } = require('../utils/auth');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/', isAuthorized);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

//* RENDER UPDATE
router.get('/', renderUpdate);

//* PROCESS CREATE (add new page to website)
router.post('/create', isAuthorized, processCreate);

//* PROCESS UPDATE (change nav visibility and/or order)
router.put('/', processUpdate);

//! CATCHALL
router.get('/*', async (req, res) => {
    console.log('webmaster catchall invoked');
    const page = await getNav(pageDir);
    res.redirect(`/${page.dir}`);
});
////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
