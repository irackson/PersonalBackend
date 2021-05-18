require('dotenv').config();
const bcrypt = require('bcryptjs');
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const adminCode = process.env.ADMIN_CODE || '';

const { sendWelcome, doUnsubscribe } = require('../utils/sub');

////////////////////////
//! Import Models
////////////////////////
const User = require('../models/User');
const Sub = require('../models/Sub');

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

const subscriptionSubmit = async (req, res) => {
    const subs = await Sub.find({}).populate({
        path: 'contentType',
    });

    // TODO: refactor this trash
    if (req.body.projects === 'on' && req.body.blog === 'on') {
        for (let i = 0; i < subs.length; i++) {
            if (
                subs[i].subscribers.filter((e) => e.email === req.body.email)
                    .length === 0
            ) {
                subs[i].subscribers.push({
                    first_name:
                        req.body.first_name === ''
                            ? 'Stranger'
                            : req.body.first_name,
                    email: req.body.email,
                    confirmation: true,
                });
            }
        }
        if (
            (await sendWelcome(
                'projects',
                req.body.first_name,
                req.body.email
            )) &&
            (await sendWelcome('blog', req.body.first_name, req.body.email))
        ) {
            for (let i = 0; i < subs.length; i++) {
                await subs[i].save();
            }
            req.session.sub = {
                projects: true,
                blog: true,
            };
            console.log(req.session.sub);
        }
    } else if (req.body.projects === 'on') {
        const projectSub = subs.filter(
            (e) => e.contentType.dir === 'projects'
        )[0];
        if (
            projectSub.subscribers.filter((e) => e.email === req.body.email)
                .length === 0
        ) {
            projectSub.subscribers.push({
                first_name:
                    req.body.first_name === ''
                        ? 'Stranger'
                        : req.body.first_name,
                email: req.body.email,
                confirmation: true,
            });

            if (
                await sendWelcome(
                    'projects',
                    req.body.first_name,
                    req.body.email
                )
            ) {
                await projectSub.save();
                req.session.sub.projects = true;
                console.log(req.session.sub);
            }
        }
    } else if (req.body.blog === 'on') {
        const blogSub = subs.filter((e) => e.contentType.dir === 'blog')[0];
        if (
            blogSub.subscribers.filter((e) => e.email === req.body.email)
                .length === 0
        ) {
            blogSub.subscribers.push({
                first_name:
                    req.body.first_name === ''
                        ? 'Stranger'
                        : req.body.first_name,
                email: req.body.email,
                confirmation: true,
            });

            if (
                await sendWelcome('blog', req.body.first_name, req.body.email)
            ) {
                await blogSub.save();
                req.session.sub.blog = true;
                console.log(req.session.sub);
            }
        }
    }
    //! TODO is this right!??!
    if (req.session.admin) {
        try {
            res.redirect('back');
        } catch (error) {
            res.redirect('/');
        }
    } else {
        res.json({
            first_name: req.body.first_name,
            email: req.body.email,
            subscribedToProjects: req.session.sub.projects,
            subscribedToBlog: req.session.sub.blog,
        });
    }
};

const unsubscribeRender = async (req, res) => {
    const params = req._parsedOriginalUrl._raw.split('/').pop().split('&');

    const email = params[0].split('=').pop();
    const contentType = params[1].split('=').pop();

    res.render('users/unsubscribe', {
        email,
        contentType,
    });
};

const unsubscribeSubmit = async (req, res) => {
    const params = req.params[0].split('&');

    const email = params[0].split('=').pop();
    const contentType = params[1].split('=').pop();

    res.json(await doUnsubscribe(contentType, email));
};

const logout = (req, res) => {
    req.session.user = undefined;
    req.session.admin = undefined;
    req.session.sub = undefined;
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
    subscriptionSubmit,
    unsubscribeRender,
    unsubscribeSubmit,
};
