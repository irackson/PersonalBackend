// TODO
// confirmation email
// associate with user if logged in

//! import dependencies
require('dotenv').config();
const nodemailer = require('nodemailer');
const nodemailMailgun = require('nodemailer-mailgun-transport');

//! import modules;
const Sub = require('../models/Sub');

//* config
const auth = {
    auth: {
        api_key: process.env.MAILGUN_API,
        domain: process.env.MAILGUN_DOMAIN,
    },
};
let transporter = nodemailer.createTransport(nodemailMailgun(auth));

//* helper functions
const composeSubject = (page, post) => {
    let textString = '';

    textString += `My new ${page.name}! Presenting... ${post.title}`;

    return textString;
};

const composeMessage = (page, post) => {
    let textString = '';

    textString += `Please check out the new ${page.name} I just posted! \n`;
    textString += `Here's a short description: ${post.description}\n`;

    if (page.dir === 'projects') {
        textString += `Live link: ${post.liveLink} \n`;
        textString += `Code link: ${post.codeLink} \n`;
    }

    return textString;
};

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

    //! send email
    const mailOptions = {
        from: `Ian Rackson <${process.env.MAILGUN_FROM}>`,
        to: isolateEmails(
            subs.filter((e) => e.contentType.dir === page.dir)[0].subscribers
        ),
        subject: composeSubject(page, post),
        text: composeMessage(page, post),
    };

    // Step 4
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('Mail error: ', err);
        } else {
            console.log('email successfully distributed');
        }
    });
};

module.exports = { sendSub };
