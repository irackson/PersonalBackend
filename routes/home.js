//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');
const contact = require('../public/assets/Contact.json');
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
const MetricsRouter = require('./metrics');
const ResumeRouter = require('./resume');
const AboutRouter = require('./about');
const AllRouter = require('./all');

///////////////////////////////
//! Router Specific Middleware
////////////////////////////////

router.use('/webmaster', WebmasterRouter);
router.use('/blog', BlogRouter);
router.use('/projects', ProjectsRouter);
router.use('/metrics', MetricsRouter);
router.use('/resume', ResumeRouter);
router.use('/about', AboutRouter);
router.use('/users', UsersRouter);
router.use('/all', AllRouter);

////////////////////////////////
//! Router Specific Routes
////////////////////////////////
const pageDir = '/';

router.get('/', async (req, res) => {
    const page = await getNav(pageDir);
    const pages = await buildNavbar(req.session.admin);

    const featuredBlog = await Blog.findOne({ featured: true });
    const featuredProject = await Project.findOne({ featured: true });

    req.session.admin
        ? res.render('home', {
              page,
              pages,
              admin: req.session.admin,
              sub: req.session.sub,
              blog: featuredBlog,
              project: featuredProject,
          })
        : res.json({
              contact,
              blog: featuredBlog.visible ? featuredBlog : null,
              project: featuredProject.visible ? featuredProject : null,
          });
});

////////////////////////////////
//! Export the Router
////////////////////////////////

module.exports = router;
