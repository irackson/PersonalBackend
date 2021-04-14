const { getNav } = require('../utils/nav');

const isActive = async (req, res, next) => {
    // console.log(req._parsedOriginalUrl.pathname.split('/')[1]);
    const page = await getNav(req._parsedOriginalUrl.pathname.split('/')[1]);

    if (page.visible || req.session.admin) {
        next();
    } else {
        res.json({
            message: `the subdirectory you are trying to access exists, but is currently under construction`,
        });
    }

    // if (!page.visible && !req.session.admin) {
    //     res.json({ message: 'hi' });
    // } else {
    //     next();
    // }
    // next();
};

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.json({
            message: 'You must be to be logged in to see this page',
        });
    }
};

const isAuthorized = (req, res, next) => {
    if (req.session.admin === true) {
        next();
    } else {
        res.json({
            message: 'You must have admin status to see this page.',
        });
    }
};

module.exports = {
    isActive,
    isAuthenticated,
    isAuthorized,
};
