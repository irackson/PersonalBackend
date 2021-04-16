//! create our new router
const router = require('express').Router();
const {
    getCreate,
    createSubmit,
    getLogin,
    loginSubmit,
    logout,
    subscriptionSubmit,
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

//* SUB SUBMIT
router.post('/subscribe', subscriptionSubmit);

//* LOGOUT
router.get('/logout', logout);

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
