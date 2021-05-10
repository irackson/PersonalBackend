//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');
const about = require('../public/assets/QA.json');
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
        : res.json(about);
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageDir,
    renderIndex,
};
