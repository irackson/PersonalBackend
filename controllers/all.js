const contact = require('../public/assets/Contact.json');
const about = require('../public/assets/QA.json');
const Blog = require('../models/Blog');
const Project = require('../models/Project');

const renderIndex = async (req, res) => {
    const blogs = await Blog.find({ visible: true });
    const projects = await Project.find({ visible: true });
    const featuredBlog = blogs.find((e) => e.featured);
    const featuredProject = projects.find((e) => e.featured);

    res.json({
        contact,
        about,
        blogs,
        projects,
        featuredBlog,
        featuredProject,
    });
};

module.exports = { renderIndex };
