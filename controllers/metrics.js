//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');

////////////////////////
//! Import Models
////////////////////////

///////////////////////////
//! Controller Functions
///////////////////////////
const pageDir = 'metrics';

const renderIndex = async (req, res) => {
    const page = await getNav(pageDir);
    res.render(`${page.dir}`, {
        page,
        pages: await buildNavbar(req.session.admin),
        admin: req.session.admin,
        sub: req.session.sub,
    });
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageDir,
    renderIndex,
};
