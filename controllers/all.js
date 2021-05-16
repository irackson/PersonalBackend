const { buildNavbar, getNav } = require('../utils/nav');
const { getExistingTags } = require('../utils/filter');
const contact = require('../public/assets/Contact.json');

const Blog = require('../models/Blog');
const Project = require('../models/Project');

const renderIndex = async (req, res) => {
    const pages = await buildNavbar(false);
    const blogs = await Blog.find({ visible: true });
    const blogs_filters = await getExistingTags(Blog, false);
    const projects = await Project.find({ visible: true });
    const projects_filters = await getExistingTags(Project, false);

    const featuredBlog = await Blog.findOne({ featured: true, visible: true });
    const featuredProject = await Project.findOne({
        featured: true,
        visible: true,
    });

    res.json({
        pages,
        blogs,
        blogs_filters,
        projects,
        projects_filters,
        featuredBlog,
        featuredProject,
    });
};

module.exports = { renderIndex };
