//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');
const { isAuthorized } = require('../utils/auth');

////////////////////////
//! Import Models
////////////////////////
const Blog = require('../models/Blog');
const Project = require('../models/Project');

//! import routers
const router = require('express').Router();
const WebmasterRouter = require('./webmaster');
const UsersRouter = require('./users');
const BlogRouter = require('./blog');
const ProjectsRouter = require('./projects');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/webmaster', WebmasterRouter);
router.use('/blog', BlogRouter);
router.use('/projects', ProjectsRouter);
router.use('/users', UsersRouter);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////
const pageDir = '/';

router.get('/', async (req, res) => {
    const page = await getNav(pageDir);
    const pages = await buildNavbar(req.session.admin);

    const featuredBlog = await Blog.findOne({ featured: true });
    const featuredProject = await Project.findOne({ featured: true });

    res.render('home', {
        page,
        pages,
        admin: req.session.admin,
        sub: req.session.sub,
        blog: featuredBlog,
        project: featuredProject,
    });
});

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
