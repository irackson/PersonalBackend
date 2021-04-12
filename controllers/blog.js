const { buildNav } = require('../utils/nav');

////////////////////////
//! Import Models
////////////////////////

const Blog = require('../models/Blog');

///////////////////////////
//! Controller Functions
///////////////////////////
const pageName = 'blog';
const pageDir = pageName;

const renderIndex = async (req, res) => {
    const blogs = req.session.admin
        ? await Blog.find({})
        : await Blog.find({ visible: true });
    res.render(`${pageDir}/index`, {
        pageName: pageName.toUpperCase(),
        pages: await buildNav(pageName),
        admin: req.session.admin,
        blogs,
    });
};

const renderCreate = async (req, res) => {
    res.render(`${pageDir}/create`, {
        pageName: `New ${pageName.toUpperCase()}`,
    });
};

const renderShow = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    res.render(`${pageDir}/show`, {
        pageName: pageName.toUpperCase(),
        pages: await buildNav(pageName),
        admin: req.session.admin,
        blog,
    });
};

const renderUpdate = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    res.render(`${pageDir}/update`, {
        pageName: `Update ${pageName.toUpperCase()}`,
        blog,
    });
};

const processCreate = async (req, res) => {
    const blog = req.body;
    for (property in blog) {
        if (blog[property] === '') {
            blog[property] = null;
        }
    }
    await Blog.create(blog);
    res.redirect(`${pageDir}`);
};

const processUpdate = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    const edits = req.body;
    for (const property in edits) {
        if (edits[property] !== '') {
            blog[property] = edits[property];
        }
    }
    await Blog.findOneAndUpdate({ slug: req.params.slug }, blog); //? or blog.save?
    res.redirect(`${req.params.slug}`);
};

const processToggle = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    blog.visible = !blog.visible;

    await Blog.findOneAndUpdate({ slug: req.params.slug }, blog); //? or blog.save?
    res.redirect(`${pageDir}`);
};

const processDestroy = async (req, res) => {
    await Blog.findOneAndDelete({ slug: req.params.slug });
    res.redirect(`${pageDir}`);
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    renderIndex,
    renderCreate,
    renderShow,
    renderUpdate,
    processCreate,
    processUpdate,
    processToggle,
    processDestroy,
};
