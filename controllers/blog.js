//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');
const { getExistingTags } = require('../utils/filter');
const { editsToBlog } = require('../utils/blog');
////////////////////////
//! Import Models
////////////////////////

const Blog = require('../models/Blog');

///////////////////////////
//! Controller Functions
///////////////////////////
const pageName = 'blog';
const repeatPrefix = 'repeat=';

const renderIndex = async (req, res) => {
    const page = await getNav(pageName);
    const blogs = req.session.admin
        ? await Blog.find({})
        : await Blog.find({ visible: true });
    const filters = await getExistingTags(Blog);

    res.render(`${page.dir}/index`, {
        page,
        pages: await buildNavbar(pageName),
        admin: req.session.admin,
        blogs,
        filters,
    });
};

const renderCreate = async (req, res) => {
    const page = await getNav(pageName);
    const existingTags = await getExistingTags(Blog);

    res.render(`${page.dir}/create`, {
        page,
        pages: await buildNavbar(pageName),
        existingTags,
        repeatPrefix,
    });
};

const renderShow = async (req, res) => {
    const page = await getNav(pageName);
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog === null) {
        res.redirect(`/${page.dir}`);
    } else if (!blog.visible && !req.session.admin) {
        res.json({
            message:
                'the page you are trying to access exists, but is currently under construction',
        });
    } else {
        if (blog.updatedAt - blog.createdAt < 8.64 * (10 ^ 7)) {
            blog.updatedAt = null;
        } else {
            blog.updatedAt = new Date(blog.updatedAt)
                .toISOString()
                .substring(0, 10);
        }
        blog.createdAt = new Date(blog.createdAt)
            .toISOString()
            .substring(0, 10);

        res.render(`${page.dir}/show`, {
            page,
            pages: await buildNavbar(pageName),
            admin: req.session.admin,
            blog,
        });
    }
};

const renderUpdate = async (req, res) => {
    const page = await getNav(pageName);
    const blog = await Blog.findOne({ slug: req.params.slug });
    const existingTags = await getExistingTags(Blog);

    res.render(`${page.dir}/update`, {
        page,
        pages: await buildNavbar(pageName),
        existingTags,
        repeatPrefix,
        blog,
    });
};

const processCreate = async (req, res) => {
    const page = await getNav(pageName);
    const tempTitle = Math.random().toString();
    let blog = await Blog.create(
        new Blog({
            title: tempTitle,
            description: 'temp',
            tags: ['temp'],
            markdown: 'temp',
        })
    );
    blog = await Blog.findOne({ title: tempTitle });
    const edits = req.body;
    blog = await editsToBlog(Blog, edits, blog, repeatPrefix);
    try {
        blog = await blog.save();

        res.redirect(`${page.dir}/${blog.slug}`);
    } catch (error) {
        console.log(error);

        res.redirect(`${page.dir}/create`);
    }
};

const processUpdate = async (req, res) => {
    const page = await getNav(pageName);
    let blog = await Blog.findOne({ slug: req.params.slug });
    const edits = req.body;
    blog = await editsToBlog(Blog, edits, blog, repeatPrefix);
    try {
        blog = await blog.save();

        res.redirect(`${blog.slug}`);
    } catch (error) {
        console.log('error');

        res.redirect(`${blog.slug}/update`);
    }
};

const processToggle = async (req, res) => {
    const page = await getNav(pageName);

    const blog = await Blog.findOne({ slug: req.params.slug });
    blog.visible = !blog.visible;

    await Blog.findOneAndUpdate({ slug: req.params.slug }, blog); //? or blog.save?

    res.redirect(`${page.dir}`);
};

const processDestroy = async (req, res) => {
    const page = await getNav(pageName);
    await Blog.findOneAndDelete({ slug: req.params.slug });

    res.redirect(`/${page.dir}`);
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageName,
    renderIndex,
    renderCreate,
    renderShow,
    renderUpdate,
    processCreate,
    processUpdate,
    processToggle,
    processDestroy,
};
