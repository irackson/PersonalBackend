const { buildNavbar, getNav } = require('../utils/nav');

////////////////////////
//! Import Models
////////////////////////

const Blog = require('../models/Blog');

///////////////////////////
//! Controller Functions
///////////////////////////
const pageName = 'blog';

const renderIndex = async (req, res) => {
    const page = await getNav(pageName);
    const blogs = req.session.admin
        ? await Blog.find({})
        : await Blog.find({ visible: true });
    res.render(`${page.dir}/index`, {
        page,
        pages: await buildNavbar(pageName),
        admin: req.session.admin,
        blogs,
    });
};

const renderCreate = async (req, res) => {
    const page = await getNav(pageName);
    const existingTags = await Blog.find({ tags: { $ne: ['other'] } }, 'tags');
    res.render(`${page.dir}/create`, {
        page,
        pages: await buildNavbar(pageName),
        existingTags: existingTags.tags ? existingTags.tags : [],
    });
};

const renderShow = async (req, res) => {
    const page = await getNav(pageName);

    const blog = await Blog.findOne({ slug: req.params.slug });

    res.render(`${page.dir}/show`, {
        page,
        pages: await buildNavbar(pageName),
        admin: req.session.admin,
        blog,
    });
};

const renderUpdate = async (req, res) => {
    const page = await getNav(pageName);

    const blog = await Blog.findOne({ slug: req.params.slug });

    res.render(`${page.dir}/update`, {
        page,
        blog,
    });
};

const processCreate = async (req, res) => {
    const page = await getNav(pageName);
    const blog = req.body;
    blog.tags = blog.tags ? blog.tags.split(',').map((e) => e.trim()) : [];

    console.log(blog);
    for (property in blog) {
        if (parseInt(property)) {
            blog.tags.push(blog[property]);
            continue;
        }
        if (blog[property] === 'on') {
            console.log(property);
            blog[property] = true;
            continue;
        }
        if (blog[property] === '') {
            blog[property] = undefined;
            continue;
        }
    }
    console.log(blog);
    try {
        const newBlog = await Blog.create(blog);
        console.log('success');
        console.log(newBlog);
        res.redirect(`${page.dir}/${newBlog.slug}`);
    } catch (e) {
        res.json({
            message: 'failed to create post',
            attempt: blog,
            format: new Blog(),
        });
    }
};

const processUpdate = async (req, res) => {
    const page = await getNav(pageName);

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
    const page = await getNav(pageName);

    const blog = await Blog.findOne({ slug: req.params.slug });
    blog.visible = !blog.visible;

    await Blog.findOneAndUpdate({ slug: req.params.slug }, blog); //? or blog.save?
    res.redirect(`${page.dir}`);
};

const processDestroy = async (req, res) => {
    const page = await getNav(pageName);

    await Blog.findOneAndDelete({ slug: req.params.slug });
    res.redirect(`${page.dir}`);
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
