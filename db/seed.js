// import the database connection
const mongoose = require('./connection');

//////////////////////////////////
// Import Your Models Below
/////////////////////////////////

const Nav = require('../models/Nav');

/////////////////////////////////
// Do your Database Operations in Below Function
/////////////////////////////////
const seed = async () => {
    //--- CODE GOES HERE
    //clear collections before seeding
    await Nav.deleteMany({}); // to clear cross-site linkage
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
};

// run seed function
mongoose.connection.on('open', () => {
    // Run Seed Function
    seed();
});
