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
    isAuthenticated,
    isAuthorized,
};
