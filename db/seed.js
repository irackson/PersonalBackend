// import the database connection
const mongoose = require('./connection');

//////////////////////////////////
// Import Your Models Below
/////////////////////////////////

// const User = require('../models/User');
const Nav = require('../models/Nav');
const Sub = require('../models/Sub');
const Blog = require('../models/Blog');
const Project = require('../models/Project');

/////////////////////////////////
// Do your Database Operations in Below Function
/////////////////////////////////
const seed = async () => {
    //--- CODE GOES HERE
    //clear collections before seeding
    await Nav.deleteMany({}); // to clear cross-site linkage
    await Sub.deleteMany({}); // to clear cross-site linkage
    await Blog.deleteMany({}); // to clear all blogs
    await Project.deleteMany({}); // to clear all blogs

    // await User.deleteMany({}); // to clear accounts
    //--------------------
    await Nav.create([
        {
            name: 'home',
            dir: '/',
            position: 0,
        },
        {
            name: 'projects',
            dir: 'projects',
            position: 1,
        },
        {
            name: 'services',
            dir: 'services',
            visible: false,
            position: 2,
        },
        {
            name: 'vip',
            dir: 'vip',
            position: 7,
        },
        {
            name: 'about',
            dir: 'about',
            visible: 'false',
            position: 3,
        },
        {
            name: 'résumé',
            dir: 'resume',
            position: 4,
        },
        {
            name: 'blog',
            dir: 'blog',
            position: 6,
        },
        {
            name: 'metrics',
            dir: 'metrics',
            position: 5,
        },
        {
            name: 'webmaster',
            dir: 'webmaster',
            visible: false,
            position: 99,
        },
    ]);

    //* if seeding multiple blog posts, make sure that only one is featured
    await Blog.create([
        {
            title: 'My First Blog Post!',
            description:
                'this blog post is intended to test the blog creation mechanism',
            tags: ['test'],
            markdown:
                '### <pre><code class="language-js">console.log("hello world")</code></pre>',
            thumbnail:
                'https://cdn3.iconfinder.com/data/icons/software-development-filled-line/2048/5414_-_Hello_World_Program-512.png',
            previouslySent: 'true',
            featured: 'true',
            visible: 'true',
        },
    ]);

    //* if seeding multiple project posts, make sure that only one is featured
    await Project.create([
        {
            title: 'Boilerplate Store',
            liveLink: 'https://irackson-boilerplate-store.herokuapp.com/',
            codeLink: 'https://github.com/irackson/BoilerplateStore',
            description:
                'an online store ready to ship, where store owners can full CRUD products and manage customer orders',
            tags: ['test', 'auth', 'MongoDB', 'back-end'],
            markdown:
                '### <pre><code class="language-js">console.log("Welcome to the Boilerplate Store!")</code></pre>',
            thumbnail: 'https://i.imgur.com/OsYK1u2.png',
            previouslySent: 'true',
            featured: 'true',
            visible: 'true',
        },
        {
            codeLink: 'https://github.com/irackson/PortfolioWebsite',
            tags: ['express', 'mongo', 'marked', 'node', 'mailgun'],
            visible: true,
            previouslySent: true,
            featured: false,
            thumbnail: 'https://i.imgur.com/IABVhMb.png',
            title: 'My Personal Website',
            liveLink: 'https://ianrackson.herokuapp.com',
            description: 'this is the website you are currently using!',
            markdown:
                '## Project Summary [![wakatime](https://wakatime.com/badge/github/irackson/PortfolioWebsite.svg)](https://wakatime.com/badge/github/irackson/PortfolioWebsite)\r\n\r\n-   This project serves as the backend of my personal website / portfolio / blog\r\n\r\n##\r\n\r\n## Technology Used\r\n\r\n### Dependencies\r\n\r\n-   [mongoose](https://www.npmjs.com/package/mongoose) (for [MongoDB](https://www.mongodb.com/) database operations)\r\n\r\n-   [express](https://www.npmjs.com/package/express) / [express-session](https://www.npmjs.com/package/express-session) / [method-override](https://www.npmjs.com/package/method-override) / [cors](https://www.npmjs.com/package/cors)\r\n\r\n-   [bcryptjs](https://www.npmjs.com/package/bcryptjs) / [dotenv](https://www.npmjs.com/package/dotenv)\r\n\r\n-   [marked](https://www.npmjs.com/package/marked) / [dompurify](https://www.npmjs.com/package/dompurify) / [jsdom](https://www.npmjs.com/package/jsdom)\r\n\r\n-   [slugify](https://www.npmjs.com/package/slugify)\r\n\r\n-   [nodemailer](https://www.npmjs.com/package/nodemailer) / [nodemailer-mailgun-transport](https://www.npmjs.com/package/nodemailer-mailgun-transport)\r\n\r\n### Workflow (Developer Dependencies)\r\n\r\n-   VS Code tasks\r\n-   [nodemon](https://www.npmjs.com/package/nodemon)\r\n\r\n-   [gulp](https://www.npmjs.com/package/gulp) / [gulp-dart-sass](https://www.npmjs.com/package/gulp-dart-sass) / [gulp-concat](https://www.npmjs.com/package/gulp-concat) / [gulp-postcss](https://www.npmjs.com/package/gulp-postcss) / [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) / [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) / [autoprefixer](https://www.npmjs.com/package/autoprefixer) / [cssnano](https://www.npmjs.com/package/cssnano)\r\n\r\n### Agile Project Management\r\n\r\n-   [Trello](https://trello.com/invite/b/VVhnA2Ep/0b2b28bebd161fbfa902d7be50dd657b/porfoliowebsite) (for User Stories, Ice Box, Current/MVP, Completed)\r\n\r\n-   [diagrams.net](https://app.diagrams.net/) (for Sitemap)\r\n\r\n    ![](https://trello-attachments.s3.amazonaws.com/606ce72d6fdb47289f6c9435/607127033a4d7f62ea5be511/84a351a1738c1d36fa00bdb81bb0332d/5fg8Fwu.png)\r\n\r\n-   [Figma](https://www.figma.com/file/ku3I4S26RbzT23bggfxzdV/Wireframes?node-id=0%3A1) (for Wireframes)\r\n\r\n    Home page (desktop)\r\n\r\n    ![](https://trello-attachments.s3.amazonaws.com/606ce72d6fdb47289f6c9435/60721c018daf1f42aa5e0c1a/c3a5c8f251c66b74f35a87ea05d4fe53/m1wOIYb.png)\r\n\r\n    Home page (mobile)\r\n\r\n    ![](https://trello-attachments.s3.amazonaws.com/606ce72d6fdb47289f6c9435/60721ce832b49e4061b9a8a7/289ec6f9e2d52827dfda39a170585795/lHAAfCz.png)\r\n\r\n    Apps page (currently Projects)\r\n\r\n    ![](https://trello-attachments.s3.amazonaws.com/606ce72d6fdb47289f6c9435/60721bbe55b5356d925fae6a/d72466e75483382d45cc81dbb313c2cd/LX8dFf9.png)\r\n\r\n## Models\r\n\r\n### User Model:\r\n\r\n```javascript\r\nconst UserSchema = new Schema(\r\n    {\r\n        username: { type: String, unique: true, required: true },\r\n        password: { type: String, required: true },\r\n        admin: { type: Boolean, required: true },\r\n        vip: { type: Boolean, default: false },\r\n    },\r\n    { timestamps: true }\r\n);\r\n```\r\n\r\n### Nav Model (Navigation):\r\n\r\n```javascript\r\nconst NavSchema = new Schema(\r\n    {\r\n        name: { type: String, required: true, unique: true },\r\n        dir: { type: String, required: true, unique: true },\r\n        visible: { type: Boolean, default: true },\r\n        position: { type: Number, required: true },\r\n    },\r\n    { timestamps: true }\r\n);\r\n```\r\n\r\n### Project Model:\r\n\r\n(same as Blog Model but with liveLink and codeLink properties added)\r\n\r\n```javascript\r\nconst ProjectSchema = new Schema(\r\n    {\r\n        title: { type: String, required: true },\r\n        liveLink: { type: String, required: true },\r\n        codeLink: { type: String, default: \'https://github.com/irackson\' },\r\n        description: { type: String, required: true },\r\n        tags: { type: [String], required: true },\r\n        visible: { type: Boolean, default: false },\r\n        previouslySent: { type: Boolean, default: false },\r\n        markdown: { type: String, required: true },\r\n        featured: { type: Boolean, default: false },\r\n        thumbnail: {\r\n            type: String,\r\n            default: \'relevant-stock-icon.png\',\r\n        },\r\n        slug: {\r\n            type: String,\r\n            required: true,\r\n            unique: true,\r\n        },\r\n        sanitizedHtml: {\r\n            type: String,\r\n            required: true,\r\n        },\r\n    },\r\n    { timestamps: true }\r\n);\r\n\r\nProjectSchema.pre(\'validate\', function (next) {\r\n    if (this.title) {\r\n        this.slug = slugify(this.title, { lower: true, strict: true });\r\n    }\r\n\r\n    if (this.markdown) {\r\n        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));\r\n    }\r\n\r\n    next();\r\n});\r\n```\r\n\r\n### Sub Model (Subscription):\r\n\r\n```javascript\r\nconst SubSchema = new Schema(\r\n    {\r\n        contentType: {\r\n            type: Schema.Types.ObjectId,\r\n            ref: \'Nav\',\r\n            required: true,\r\n        },\r\n        subscribers: {\r\n            type: [\r\n                {\r\n                    first_name: { type: String },\r\n                    email: { type: String, required: true },\r\n                    confirmation: { type: Boolean, default: false },\r\n                    account: { type: Schema.Types.ObjectId, ref: \'User\' },\r\n                },\r\n            ],\r\n            active: { type: Boolean, default: false },\r\n            default: [],\r\n        },\r\n    },\r\n    { timestamps: true }\r\n);\r\n```\r\n\r\n## Route Maps\r\n\r\n### Users ("/users")\r\n\r\n| Method | Endpoint          | Resource/View                                         |\r\n| ------ | ----------------- | ----------------------------------------------------- |\r\n| GET    | "/create"         | Render form for new User (users/create.ejs)           |\r\n| POST   | "/create"         | Uses Form Submission to Create new User               |\r\n| GET    | "/login"          | Display a Particular Post (projects/show.ejs)         |\r\n| POST   | "/login"          | Render form to User login  (projects/update.ejs)      |\r\n| POST   | "/subscribe"      | Uses partials/footer.ejs Form Submission to Subscribe |\r\n| GET    | "/unsubscribe/\\*" | Render form to Unsubscribe  (users/unsubscribe.ejs)   |\r\n| POST   | "/unsubscribe/\\*" | Uses Form Submission to Unsubscribe                   |\r\n| GET    | "/logout"         | Logout a particular User                              |\r\n| GET    | "/\\*"             | Catch-all redirect to "/" (home page)                 |\r\n\r\n### Projects ("/projects")\r\n\r\n| Method | Endpoint        | Resource/View                                   |\r\n| ------ | --------------- | ----------------------------------------------- |\r\n| GET    | "/"             | List all Posts (projects/index.ejs)             |\r\n| GET    | "/create"       | Render form for New Post (projects/create.ejs)  |\r\n| GET    | "/:slug"        | Display a Particular Post (projects/show.ejs)   |\r\n| POST   | "/"             | Uses Form Submission to Create new Post         |\r\n| GET    | "/:slug/update" | Render form to edit Post  (projects/update.ejs) |\r\n| PUT    | "/:slug"        | Uses Form Submission to edit Post               |\r\n| DELETE | "/:slug"        | Delete a particular Post                        |\r\n| GET    | "/\\*"           | Catch-all redirect to "/projects"               |\r\n\r\n### Blog ("/blog<endpoint>")\r\n\r\n| Method | Endpoint        | Resource/View                               |\r\n| ------ | --------------- | ------------------------------------------- |\r\n| GET    | "/"             | List all Posts (blog/index.ejs)             |\r\n| GET    | "/create"       | Render form for New Post (blog/create.ejs)  |\r\n| GET    | "/:slug"        | Display a Particular Post (blog/show.ejs)   |\r\n| POST   | "/"             | Uses Form Submission to Create new Post     |\r\n| GET    | "/:slug/update" | Render form to edit Post  (blog/update.ejs) |\r\n| PUT    | "/:slug"        | Uses Form Submission to edit Post           |\r\n| DELETE | "/:slug"        | Delete a particular Post                    |\r\n| GET    | "/\\*"           | Catch-all redirect to "/blog"               |\r\n\r\n### Metrics ("/metrics")\r\n\r\n| Method | Endpoint | Resource/View                          |\r\n| ------ | -------- | -------------------------------------- |\r\n| GET    | "/"      | List all Metrics ("metrics/index.ejs") |\r\n| GET    | "/\\*"    | Catch-all redirect to "/metrics"       |\r\n\r\n### Resume ("/resume")\r\n\r\n| Method | Endpoint    | Resource/View                           |\r\n| ------ | ----------- | --------------------------------------- |\r\n| GET    | "/"         | Render Resume page ("resume/index.ejs") |\r\n| GET    | "/download" | Download Resume from public assets      |\r\n| GET    | "/\\*"       | Catch-all redirect to "/resume"         |\r\n\r\n### Webmaster ("/webmaster")\r\n\r\n| Method | Endpoint | Resource/View                                              |\r\n| ------ | -------- | ---------------------------------------------------------- |\r\n| GET    | "/"      | Render form for Sitewide Settings (webmaster/settings.ejs) |\r\n| POST   | "/seed"  | Reseed the Database                                        |\r\n| PUT    | "/"      | Uses Form Submission to edit Sitewide Settings             |\r\n| GET    | "/\\*"    | Catch-all redirect to "/webmaster"                         |\r\n\r\n## Challenges\r\n\r\n-   Too many to count!\r\n\r\n## Existing Bugs\r\n\r\n-   There are over nine hundred thousand different different species of bugs\r\n\r\n## Notes\r\n\r\n-   to render code in markdown properly with prism, you must use this pattern:\r\n\r\n    `<pre><code class="language-css">p { color: red }</code></pre>`\r\n',
            slug: 'my-personal-website',
        },
    ]);

    //* seed email lists
    const projectsNav = await Nav.findOne({ dir: 'projects' });
    const blogNav = await Nav.findOne({ dir: 'blog' });

    await Sub.create([
        {
            contentType: projectsNav._id,
            active: true,
        },
        {
            contentType: blogNav._id,
            active: true,
        },
    ]);
};

// run seed function
/* mongoose.connection.on('open', async () => {
    // Run Seed Function
    await seed();
    console.log('done seeding');
    mongoose.connection.close();
}); */

module.exports = { seed };
