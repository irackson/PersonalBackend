const { getNav } = require('../utils/nav');

//! create our new router
const router = require('express').Router();
const {
    pageName,
    renderUpdate,
    processUpdate,
} = require('../controllers/webmaster');
const { isAuthorized } = require('../utils/auth');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

//* RENDER UPDATE
router.get('/', isAuthorized, renderUpdate);

//* PROCESS UPDATE
router.put('/', isAuthorized, processUpdate);

//! CATCHALL
router.get('/*', async (req, res) => {
    console.log('webmaster catchall invoked');
    const page = await getNav(pageName);
    res.redirect(`/${page.dir}`);
});
////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
