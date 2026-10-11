//!  __   ___  __   ___       __   ___       __     ___  __
//! |  \ |__  |__) |__  |\ | |  \ |__  |\ | /  ` | |__  /__`
//! |__/ |___ |    |___ | \| |__/ |___ | \| \__, | |___ .__/

//* Require Modules
require('dotenv').config();
const express = require('express');
require('express-async-errors');
const path = require('path');
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
const SECRET = process.env.SECRET;
if (!SECRET || !process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL and SECRET must be configured.');
}
//! Import the index routers
const HomeRouter = require('./routes/home');

var store = new connect({
    uri: MONGODB_URL,
    collection: 'session',
    connectionOptions: { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 5 },
});
store.on('error', () => console.error('Session database connection failed'));

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
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

//!          __   __        ___            __   ___
//! |\/| | |  \ |  \ |    |__  |  |  /\  |__) |__
//! |  | | |__/ |__/ |___ |___ |/\| /~~\ |  \ |___

// app.use(
//     cors({ origin: 'https://www.ianrackson.com', optionsSuccessStatus: 200 })
// ); // prevent cors errors

// let whitelist = [
//     'http://localhost:3000',
//     'https://ianrackson.com',
//     'https://www.ianrackson.com',
//     'https://epic-stonebraker-4f69d2.netlify.app',
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200,
// };
app.use(cors());
//allow OPTIONS on all resources
// app.options('*', cors());
// credentials: true,

//! enable method override
app.use(methodOverride('_method'));

//! serves the public folder as static
// public is where css / scss files
app.use(express.static(path.join(__dirname, 'public')));

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
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        },
        store: store,
        // Boilerplate options, see:
        // * https://www.npmjs.com/package/express-session#resave
        // * https://www.npmjs.com/package/express-session#saveuninitialized
        resave: false,
        saveUninitialized: true,
    })
);

//! Mount Middleware (app.use)
/* app.use('/', (req, res, next) => {
    // req.time = new Date().toLocaleTimeString();
    // console.log(req.time);
    //* go to next middleware function
    // console.log(req.session);
    next();
}); */

app.use('/', (req, res, next) => {
    if (!req.session.admin) {
        req.session.admin = false;
    }

    if (!req.session.user) {
        req.session.user = false;
    }
    // console.clear();
    // console.log('before');
    // console.log(req.session.sub);
    if (!req.session.sub) {
        req.session.sub = {
            projects: false,
            blog: false,
        };
    }
    // console.log('after');
    // console.log(req.session.sub);
    next();
});

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
app.use((error, req, res, next) => {
    console.error('Request failed', { method: req.method, path: req.path, name: error.name });
    if (res.headersSent) return next(error);
    res.status(500).json({ error: 'The request could not be completed. Please try again.' });
});

module.exports = app;
if (require.main === module && !process.env.VERCEL) {
    app.listen(PORT, () => log.white('EXPRESS', `listening on port ${PORT}`));
}
