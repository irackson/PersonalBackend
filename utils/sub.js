// TODO
// confirmation email
// associate with user if logged in

//! import dependencies
require('dotenv').config();
const nodemailer = require('nodemailer');
const nodemailMailgun = require('nodemailer-mailgun-transport');

//! import modules;

// Step 1
const auth = {
    auth: {
        api_key: process.env.MAILGUN_API,
        domain: process.env.MAILGUN_DOMAIN,
    },
};

// Step 2
let transporter = nodemailer.createTransport(nodemailMailgun(auth));

const Sub = require('../models/Sub');

const isolateEmails = (subscribers) => {
    let emails = [];
    for (let i = 0; i < subscribers.length; i++) {
        if (subscribers[i].confirmation) {
            emails.push(subscribers[i].email);
        }
    }
    return emails;
};

const sendSub = async (page, post) => {
    //! get data
    const subs = await Sub.find({}).populate({
        path: 'contentType',
    });

    const sub = subs.filter((e) => e.contentType.dir === page.dir)[0];

    //! send email
    // Step 3
    const recipients = isolateEmails(sub.subscribers);
    console.log(recipients);
    const mailOptions = {
        from: `Ian Rackson <${process.env.MAILGUN_FROM}>`,
        to: recipients,
        subject: `new ${page.name}! Check out ${post.title}`,
        text: post.description,
    };

    // Step 4
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('Mail error: ', err);
        } else {
            console.log('Message sent!!');
        }
    });
};

module.exports = { sendSub };
