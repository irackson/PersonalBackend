//! Import Dependencies
const fs = require('fs');
require('dotenv').config();

//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');

////////////////////////
//! Import Models
////////////////////////

///////////////////////////
//! Controller Functions
///////////////////////////
const pageDir = 'resume';
const resumePath = `${process.env.DOMAIN}/public/assets/resume/`;
const resumeFileName = 'IanRackson-Resume.pdf';

const renderIndex = async (req, res) => {
    const page = await getNav(pageDir);
    res.render(`${page.dir}`, {
        page,
        pages: await buildNavbar(req.session.admin),
        admin: req.session.admin,
        sub: req.session.sub,
    });
};

const processDownload = (req, res) => {
    res.download(resumePath + resumeFileName, resumeFileName, (err) => {
        if (err) {
            res.status(500).send({
                message: 'Could not download the file. ' + err,
            });
        }
    });
};

const processUpload = async (req, res) => {
    console.log('processUpload invoked');
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageDir,
    renderIndex,
    processDownload,
    processUpload,
};
