// import the database connection
const mongoose = require('./connection');

//////////////////////////////////
// Import Your Models Below
/////////////////////////////////

const Nav = require('../models/Nav');
const Blog = require('../models/Blog');

/////////////////////////////////
// Do your Database Operations in Below Function
/////////////////////////////////
const seed = async () => {
    //--- CODE GOES HERE
    //clear collections before seeding
    await Nav.deleteMany({}); // to clear cross-site linkage
    await Blog.deleteMany({}); // to clear all blogs
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
            name: 'resume',
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
    ]);

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
        },
    ]);
};

// run seed function
mongoose.connection.on('open', async () => {
    // Run Seed Function
    await seed();
    console.log('done seeding');
    mongoose.connection.close();
});
