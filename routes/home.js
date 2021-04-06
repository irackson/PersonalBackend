//! import router
const router = require('express').Router();
const UsersRouter = require('./users');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/users', UsersRouter);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////

router.get('/', (req, res) => {
    res.render('home', {});
});

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
