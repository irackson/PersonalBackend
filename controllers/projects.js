//! Import Utilities
const { buildNavbar, getNav } = require('../utils/nav');
const { sendSub } = require('../utils/sub');
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
    const filters = await getExistingTags(Project, req.session.admin);
    projects.forEach((project) => {
        project.displayUpdated = formatDate(project.updatedAt);
        return project;
    });
    req.session.admin
        ? res.render(`${page.dir}/index`, {
              page,
              pages: await buildNavbar(req.session.admin),
              admin: req.session.admin,
              sub: req.session.sub,

              projects,
              filters,
          })
        : res.json({ projects, filters });
};

const renderCreate = async (req, res) => {
    const page = await getNav(pageDir);
    const existingTags = await getExistingTags(Project);

    res.render(`${page.dir}/create`, {
        page,
        pages: await buildNavbar(req.session.admin),
        admin: req.session.admin,
        sub: req.session.sub,

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
        req.session.admin
            ? res.render(`${page.dir}/show`, {
                  page,
                  pages: await buildNavbar(req.session.admin),
                  admin: req.session.admin,
                  sub: req.session.sub,

                  project,
                  displayPublished,
                  displayUpdated,
              })
            : res.json({ project, displayPublished, displayUpdated });
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
        sub: req.session.sub,

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
    project = await project.save();
    try {
        if (project.visible) {
            await sendSub(page, project);
            project.previouslySent = true;
            await project.save();
        }

        res.redirect(`${page.dir}/${project.slug}`);
    } catch (error) {
        console.log(error);

        res.redirect(`${page.dir}/create`);
    }
};

const processUpdate = async (req, res) => {
    const page = await getNav(pageDir);
    let project = await Project.findOne({ slug: req.params.slug });
    const sentStatus = project.previouslySent;
    const edits = req.body;
    project = await editsToPost(Project, edits, project, repeatPrefix);
    try {
        if (sentStatus === false && project.visible === true) {
            await sendSub(page, project);
            project.previouslySent = true;
        }
        await project.save();

        res.redirect(`${project.slug}`);
    } catch (error) {
        console.log('error');

        res.redirect(`${project.slug}/update`);
    }
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
    processDestroy,
};
