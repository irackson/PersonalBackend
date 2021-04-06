// import the database connection
const mongoose = require('./connection');

//////////////////////////////////
// Import Your Models Below
/////////////////////////////////

const User = require('../models/User');

/////////////////////////////////
// Do your Database Operations in Below Function
/////////////////////////////////
const seed = async () => {
    //--- CODE GOES HERE
    //clear collections before seeding
    // await User.deleteMany({}); // to clear accounts
    //--------------------
};

// run seed function
mongoose.connection.on('open', () => {
    // Run Seed Function
    seed();
});
