//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');

////////////////////////
//! Import Models
////////////////////////

///////////////////////////
//! Controller Functions
///////////////////////////
const pageDir = 'about';

const renderIndex = async (req, res) => {
    const page = await getNav(pageDir);
    req.session.admin
        ? res.render(`${page.dir}`, {
              page,
              pages: await buildNavbar(req.session.admin),
              admin: req.session.admin,
              sub: req.session.sub,
          })
        : res.json({ page, pages: await buildNavbar(req.session.admin) });
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageDir,
    renderIndex,
};
