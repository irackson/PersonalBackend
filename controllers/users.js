require('dotenv').config();

const bcrypt = require('bcryptjs');
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const adminCode = process.env.ADMIN_CODE || '';

////////////////////////
//! Import Models
////////////////////////
const User = require('../models/User');

///////////////////////////
//! Controller Functions
///////////////////////////

const getCreate = async (req, res) => {
    req.session.user = undefined;
    res.render('users/create');
};

async function usernameFree(attempt) {
    const users = await User.find({ username: attempt });
    if (users.length === 0) {
        return true;
    } else {
        return false;
    }
}

const createSubmit = async (req, res) => {
    if (await usernameFree(req.body.username)) {
        if (req.body.admin === 'on') {
            if (req.body.admin_code.toLowerCase() === adminCode.toLowerCase()) {
                req.body.admin = true;
            } else {
                res.json({
                    message:
                        'You have entered the wrong Admin Code. Account creation failed. Contact your web developer or call your employer for the right code, and then hit the back button and try again.',
                });
                return;
            }
        } else {
            req.body.admin = false;
        }

        const salt = await bcrypt.genSalt(saltRounds);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const user = await User.create(req.body);
        res.redirect('/users/login');
    } else {
        res.json({
            message:
                'An account already exists with this username. Account creation failed. Use the back button to create an account with a different username.',
        });
    }
};

const getLogin = async (req, res) => {
    // req.session.user = undefined;
    // req.session.admin = false;
    res.render('users/login');
};

const loginSubmit = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const result = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (result) {
                req.session.user = user.username;
                req.session.admin = user.admin;
                res.redirect('/');
            } else {
                res.status(400).json({ error: 'Password is wrong' });
            }
        } else {
            res.status(400).json({ error: 'No User by That Name' });
        }
    } catch (error) {
        res.json(error);
    }
};

const logout = (req, res) => {
    req.session.user = undefined;
    req.session.admin = false;
    res.redirect('/');
};

//////////////////////////////
//! Export Controller
//////////////////////////////
module.exports = {
    getCreate,
    createSubmit,
    getLogin,
    loginSubmit,
    logout,
};
