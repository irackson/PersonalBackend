//! create our new router
const router = require('express').Router();
const {
    getCreate,
    createSubmit,
    getLogin,
    loginSubmit,
    logout,
    subscriptionSubmit,
    unsubscribeRender,
    unsubscribeSubmit,
} = require('../controllers/users');
const { isAuthenticated, isAuthorized } = require('../utils/auth');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

//* CREATE PAGE
router.get('/create', getCreate);

//* CREATE SUBMIT
router.post('/create', createSubmit);

//* LOGIN PAGE
router.get('/login', getLogin);

//* LOGIN SUBMIT
router.post('/login', loginSubmit);

//* SUB PROCESS
router.post('/subscribe', subscriptionSubmit);

//* UNSUB RENDER
router.get('/unsubscribe/*', unsubscribeRender);

//* UNSUB PROCESS
router.post('/unsubscribe/*', unsubscribeSubmit);

//* LOGOUT
router.get('/logout', logout);

//! CATCHALL
router.get('/*', async (req, res) => {
    console.log('users catchall invoked');
    res.redirect(`/`);
});

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
