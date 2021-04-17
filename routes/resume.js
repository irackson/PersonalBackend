const { getNav } = require('../utils/nav');
const { isActive, isAuthorized } = require('../utils/auth');

//! create our new router
const router = require('express').Router();
const {
    pageDir,
    renderIndex,
    processDownload,
    processUpload,
} = require('../controllers/resume');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/', isActive);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

//* RENDER ALL
router.get('/', renderIndex);

//* PROCESS RESUME DOWNLOAD
router.get('/download', processDownload);

//* PROCESS RESUME UPLOAD
router.post('/upload', isAuthorized, processUpload);

//! CATCHALL
router.get('/*', async (req, res) => {
    console.log('resume catchall invoked');
    const page = await getNav(pageDir);
    res.redirect(`/${page.dir}`);
});
////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
