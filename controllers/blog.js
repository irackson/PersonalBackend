const { buildNavbar, getNav } = require('../utils/nav');
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
    res.render(`${page.dir}/index`, {
        page,
        pages: await buildNavbar(pageName),
        admin: req.session.admin,
        blogs,
    });
};

const renderCreate = async (req, res) => {
    const page = await getNav(pageName);
    const blogsWithTags = await Blog.find(
        { tags: { $ne: ['other'] } },
        'tags -_id'
    );
    let existingTags = [];
    for (let b = 0; b < blogsWithTags.length; b++) {
        console.log(blogsWithTags[b]);
        blogsWithTags[b]['tags'].forEach((t) => {
            if (!existingTags.includes(t)) {
                existingTags.push(t);
            }
        });
    }

    console.log(`existingTags before: ${existingTags}`);
    console.log(typeof existingTags);

    console.log(`existingTags: ${existingTags}`);
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
        console.log(property);
        if (property.substring(0, repeatPrefix.length) === repeatPrefix) {
            blog.tags.push(property.split('=').pop());
            blog[property] = undefined;
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
