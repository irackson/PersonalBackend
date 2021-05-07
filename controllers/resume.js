//! Import Dependencies

//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');

////////////////////////
//! Import Models
////////////////////////

///////////////////////////
//! Controller Functions
///////////////////////////
const pageDir = 'resume';

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

const processDownload = (req, res) => {
    res.redirect(
        'https://github.com/irackson/PortfolioWebsite/raw/42ec7dcb3a6689dce445cee77eb4180493be2a21/public/assets/resume/IanRackson-Resume.pdf'
    );
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageDir,
    renderIndex,
    processDownload,
};
