// import the database connection
const mongoose = require('./connection');

//////////////////////////////////
// Import Your Models Below
/////////////////////////////////

const User = require('../models/User');
const Nav = require('../models/Nav');
const Blog = require('../models/Blog');
const Project = require('../models/Project');

/////////////////////////////////
// Do your Database Operations in Below Function
/////////////////////////////////
const seed = async () => {
    //--- CODE GOES HERE
    //clear collections before seeding
    await Nav.deleteMany({}); // to clear cross-site linkage
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
            position: 2,
        },
        {
            name: 'vip',
            dir: 'vip',
            visible: false,
            position: 7,
        },
        {
            name: 'about',
            dir: 'about',
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
            featured: 'true',
            visible: 'true',
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
