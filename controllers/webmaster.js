//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');

////////////////////////
//! Import Models
////////////////////////

const Nav = require('../models/Nav');

///////////////////////////
//! Controller Functions
///////////////////////////
const pageDir = 'webmaster';

const renderUpdate = async (req, res) => {
    const page = await getNav(pageDir);
    const pages = await buildNavbar(req.session.admin);

    res.render(`${page.dir}/update`, {
        page,
        pages,
    });
};

const processUpdate = async (req, res) => {
    // const page = await getNav(pageDir);
    // let blog = await Blog.findOne({ slug: req.params.slug });
    // const edits = req.body;
    // blog = await editsToBlog(Blog, edits, blog, repeatPrefix);
    // try {
    //     blog = await blog.save();
    //     res.redirect(`${blog.slug}`);
    // } catch (error) {
    //     console.log('error');
    //     res.redirect(`${blog.slug}/update`);
    // }
    res.json(req.body);
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageDir,
    renderUpdate,
    processUpdate,
};
