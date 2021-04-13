//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');
const { getExistingTags } = require('../utils/filter');
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
    /*     const page = await getNav(pageName);
    const blog = req.body;
    console.log(blog);
    blog.tags = blog.tags ? blog.tags.split(',').map((e) => e.trim()) : [];
    for (property in blog) {
        if (property.substring(0, repeatPrefix.length) === repeatPrefix) {
            blog.tags.push(property.split('=').pop());
            blog[property] = undefined;
            continue;
        }
        if (blog[property] === 'on') {
            blog[property] = true;
            continue;
        }
        if (blog[property] === '') {
            blog[property] = undefined;
            continue;
        }
    }
    try {
        const newBlog = await blog.create(blog);

        res.redirect(`${page.dir}/${newBlog.slug}`);
    } catch (e) {
        res.json({
            message: 'failed to create post',
            attempt: blog,
            format: new Blog(),
        });
    } */
    const page = await getNav(pageName);

    let blog = await Blog.create(
        new Blog({
            title: 'temp',
            description: 'temp',
            tags: ['temp'],
            markdown: 'temp',
        })
    );
    blog = await Blog.findOne({ slug: blog.slug });
    console.log(blog);

    const edits = req.body;
    edits.tags = edits.tags ? edits.tags.split(',').map((e) => e.trim()) : [];
    for (property in edits) {
        if (property.substring(0, repeatPrefix.length) === repeatPrefix) {
            edits.tags.push(property.split('=').pop());
            edits[property] = undefined;
            continue;
        }
        if (edits[property] === '') {
            edits[property] = undefined;
            continue;
        }
    }
    edits.visible = edits.visible ? true : false;
    edits.featured = edits.featured ? true : false;

    for (const property in edits) {
        if (typeof edits[property] !== 'undefined') {
            blog[property] = edits[property];
        }
    }
    try {
        blog = await blog.save();
        res.redirect(`${page.dir}/${blog.slug}`);
    } catch (error) {
        console.log(error);
        res.redirect(`${page.dir}/create`);
    }
};

const processUpdate = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    const edits = req.body;
    edits.tags = edits.tags ? edits.tags.split(',').map((e) => e.trim()) : [];
    for (property in edits) {
        if (property.substring(0, repeatPrefix.length) === repeatPrefix) {
            edits.tags.push(property.split('=').pop());
            edits[property] = undefined;
            continue;
        }
        if (edits[property] === '') {
            edits[property] = undefined;
            continue;
        }
    }
    edits.visible = edits.visible ? true : false;
    edits.featured = edits.featured ? true : false;

    for (const property in edits) {
        if (typeof edits[property] !== 'undefined') {
            blog[property] = edits[property];
        }
    }

    await blog.save();
    console.log(await Blog.findOne({ slug: req.params.slug }));
    res.redirect(`${blog.slug}`);
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
