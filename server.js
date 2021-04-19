//!  __   ___  __   ___       __   ___       __     ___  __
//! |  \ |__  |__) |__  |\ | |  \ |__  |\ | /  ` | |__  /__`
//! |__/ |___ |    |___ | \| |__/ |___ | \| \__, | |___ .__/

//* Require Modules
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connect = require('connect-mongodb-session')(session);

const methodOverride = require('method-override');
const cors = require('cors');

const morgan = require('morgan');
const { log } = require('mercedlogger');

//! define env variables
const PORT = process.env.PORT || '2021';
const MONGODB_URL =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/database';
const SECRET = process.env.SECRET || 'supersecret';
//! Import the index routers
const HomeRouter = require('./routes/home');

var store = new connect({
    uri: MONGODB_URL,
    collection: 'session',
});

//! __   __   ___      ___  ___          __   __
//! /  ` |__) |__   /\   |  |__      /\  |__) |__)
//! \__, |  \ |___ /~~\  |  |___    /~~\ |    |

//! Create the Express App
const app = express();

//!         ___          ___       __          ___
//! \  / | |__  |  |    |__  |\ | / _` | |\ | |__
//!  \/  | |___ |/\|    |___ | \| \__> | | \| |___

//! Configure the App (app.set)
//! We'll use the ejs view engine
app.set('view engine', 'ejs');

//!          __   __        ___            __   ___
//! |\/| | |  \ |  \ |    |__  |  |  /\  |__) |__
//! |  | | |__/ |__/ |___ |___ |/\| /~~\ |  \ |___

app.use(cors()); // prevent cors errors

//! enable method override
app.use(methodOverride('_method'));

//! serves the public folder as static
// public is where css / scss files
app.use(express.static('public'));

//! morgan for logging
// app.use('/', morgan('tiny')); // "dev" | "tiny" | "combined"

app.use(express.json()); // parse json bodies

//! urlencoded into order to receive data from forms
app.use(express.urlencoded({ extended: false }));

//! auth
app.use(
    session({
        secret: SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
        store: store,
        // Boilerplate options, see:
        // * https://www.npmjs.com/package/express-session#resave
        // * https://www.npmjs.com/package/express-session#saveuninitialized
        resave: true,
        saveUninitialized: true,
    })
);

//! Mount Middleware (app.use)
/* app.use('/', (req, res, next) => {
    req.time = new Date().toLocaleTimeString();
    // console.log(req.time);
    //* go to next middleware function
    next();
}); */

//!   __   __       ___         __
//! |__) /  \ |  |  |  | |\ | / _`
//! |  \ \__/ \__/  |  | | \| \__>

//! Mount Routes
app.use('/', HomeRouter);

//! Mount Catchall
app.get('*', (req, res) => {
    res.redirect('/');
});

//!          __  ___  ___       ___  __
//! |    | /__`  |  |__  |\ | |__  |__)
//! |___ | .__/  |  |___ | \| |___ |  \

//! Tell the App to Listen on Port 3000
app.listen(PORT, function () {
    log.white('💻 EXPRESS 💻 ', `listening on port ${PORT}`);
});
