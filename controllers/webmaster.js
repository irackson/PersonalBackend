//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');
const { seed } = require('../db/seed');
////////////////////////
//! Import Models
////////////////////////

const Nav = require('../models/Nav');
const Sub = require('../models/Sub');

///////////////////////////
//! Controller Functions
///////////////////////////
const pageDir = 'webmaster';

const renderUpdate = async (req, res) => {
    const page = await getNav(pageDir);
    const pages = await buildNavbar(req.session.admin);

    res.render(`${page.dir}/settings`, {
        page,
        pages,
        editableNavs: pages.filter(
            (e) => e.dir !== '/' && e.dir !== 'webmaster'
        ),
        admin: req.session.admin,
        sub: req.session.sub,
    });
};

const processUpdate = async (req, res) => {
    const page = await getNav(pageDir);
    const navs = await Nav.find({ dir: { $nin: ['/', 'webmaster'] } });
    navs.sort((p1, p2) => p1.position - p2.position);

    for (let i = 0; i < navs.length; i++) {
        navs[i].position = req.body.position[i];
        navs[i].visible = false;
        for (property in req.body) {
            if (
                property !== 'name' &&
                property !== 'position' &&
                navs[i].dir === property
            ) {
                navs[i].visible = true;
            }
        }

        navs[i].name =
            req.body.name[i] === '' ? navs[i].name : req.body.name[i];
    }

    navs.sort((p1, p2) => p1.position - p2.position);
    for (let i = 0; i < navs.length; i++) {
        navs[i].position = i + 1;
        await navs[i].save();
    }

    res.redirect(`${page.dir}`);
};

const processCreate = async (req, res) => {
    console.log(req.body);
    res.redirect('back');
};

const processSeed = async (req, res) => {
    await seed();
    res.redirect('back');
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageDir,
    renderUpdate,
    processUpdate,
    processCreate,
    processSeed,
};
