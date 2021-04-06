//!  __   ___  __   ___       __   ___       __     ___  __
//! |  \ |__  |__) |__  |\ | |  \ |__  |\ | /  ` | |__  /__`
//! |__/ |___ |    |___ | \| |__/ |___ | \| \__, | |___ .__/

require('dotenv').config();
const mongoose = require('mongoose');
const { log } = require('mercedlogger');

//!  __   __             ___  __  ___
//! /  ` /  \ |\ | |\ | |__  /  `  |
//! \__, \__/ | \| | \| |___ \__,  |

//* retrieving our mongo url from our environmental variables (.env)
const MONGODB_URL =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/database';
//* store the connection object inside a variable called...
const db = mongoose.connection;
//* config object to remove warnings
const mongoconfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};
//* connect to the database
mongoose.connect(MONGODB_URL, mongoconfig, () => {
    log.cyan('STATUS', 'the connection with mongod is established');
    // console.log('the connection with mongod is established'.rainbow.bold);
});

//? alternate initial connect log command
/* mongoose.connection.once("open", () => {
    console.log("connected to mongo");
  }); */

//* Connection Error/Success
// Define callback functions for various events
db.on('error', (err) => {
    log.red('ERROR', err.message);
    // console.log(err.message + ' is mongod not running?'.red.bold)
});
db.on('connected', () => {
    log.green('STATUS', 'mongo connected/open');
    // console.clear();
    // console.log('mongo connected/open'.green.bold.bgYellow);
});
db.on('disconnected', () => {
    log.red('STATUS', 'mongo disconnected/closed');
    // console.log('mongo disconnected/closed'.blue.bgYellow)
});

////////////////////////////////
//! Export the Connection
/////////////////////////////////
module.exports = mongoose;
