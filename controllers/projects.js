//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');
const { getExistingTags } = require('../utils/filter');
const { editsToPost } = require('../utils/crud');
const { formatDate } = require('../utils/format');
////////////////////////
//! Import Models
////////////////////////

const Project = require('../models/Project');

///////////////////////////
//! Controller Functions
///////////////////////////
const pageDir = 'projects';
const repeatPrefix = 'repeat=';

const renderIndex = async (req, res) => {
    const page = await getNav(pageDir);
    let projects = req.session.admin
        ? await Project.find({})
        : await Project.find({ visible: true });
    const filters = await getExistingTags(Project);
    projects.forEach((project) => {
        project.displayUpdated = formatDate(project.updatedAt);
        return project;
    });
    res.render(`${page.dir}/index`, {
        page,
        pages: await buildNavbar(req.session.admin),
        admin: req.session.admin,
        projects,
        filters,
    });
};

const renderCreate = async (req, res) => {
    const page = await getNav(pageDir);
    const existingTags = await getExistingTags(Project);

    res.render(`${page.dir}/create`, {
        page,
        pages: await buildNavbar(req.session.admin),
        admin: req.session.admin,
        existingTags,
        repeatPrefix,
    });
};

const renderShow = async (req, res) => {
    const page = await getNav(pageDir);
    const project = await Project.findOne({ slug: req.params.slug });
    if (project === null) {
        res.redirect(`/${page.dir}`);
    } else if (!project.visible && !req.session.admin) {
        res.json({
            message:
                'the page you are trying to access exists, but is currently under construction',
        });
    } else {
        let displayUpdated = undefined;
        //* show updated if a day or more has passed
        if (
            Math.abs(
                project.createdAt.getTime() - project.updatedAt.getTime()
            ) >=
            8.64 * Math.pow(7, 10)
        ) {
            displayUpdated = formatDate(project.updatedAt);
        }
        displayPublished = formatDate(project.createdAt);

        res.render(`${page.dir}/show`, {
            page,
            pages: await buildNavbar(req.session.admin),
            admin: req.session.admin,
            project,
            displayPublished,
            displayUpdated,
        });
    }
};

const renderUpdate = async (req, res) => {
    const page = await getNav(pageDir);
    const project = await Project.findOne({ slug: req.params.slug });
    const existingTags = await getExistingTags(Project);

    res.render(`${page.dir}/update`, {
        page,
        pages: await buildNavbar(req.session.admin),
        admin: req.session.admin,

        existingTags,
        repeatPrefix,
        project,
    });
};

const processCreate = async (req, res) => {
    const page = await getNav(pageDir);
    const tempTitle = Math.random().toString();
    let project = await Project.create(
        new Project({
            title: tempTitle,
            liveLink: 'temp',
            description: 'temp',
            tags: ['temp'],
            markdown: 'temp',
        })
    );
    project = await Project.findOne({ title: tempTitle });
    const edits = req.body;
    project = await editsToPost(Project, edits, project, repeatPrefix);
    try {
        project = await project.save();

        res.redirect(`${page.dir}/${project.slug}`);
    } catch (error) {
        console.log(error);

        res.redirect(`${page.dir}/create`);
    }
};

const processUpdate = async (req, res) => {
    const page = await getNav(pageDir);
    let project = await Project.findOne({ slug: req.params.slug });
    const edits = req.body;
    project = await editsToPost(Project, edits, project, repeatPrefix);
    try {
        project = await project.save();

        res.redirect(`${project.slug}`);
    } catch (error) {
        console.log('error');

        res.redirect(`${project.slug}/update`);
    }
};

const processToggle = async (req, res) => {
    const page = await getNav(pageDir);

    const project = await Project.findOne({ slug: req.params.slug });
    project.visible = !project.visible;

    await Project.findOneAndUpdate({ slug: req.params.slug }, project); //? or project.save?

    res.redirect(`${page.dir}`);
};

const processDestroy = async (req, res) => {
    const page = await getNav(pageDir);
    await Project.findOneAndDelete({ slug: req.params.slug });

    res.redirect(`/${page.dir}`);
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    pageDir,
    renderIndex,
    renderCreate,
    renderShow,
    renderUpdate,
    processCreate,
    processUpdate,
    processToggle,
    processDestroy,
};
