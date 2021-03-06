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
    if (page.dir === 'projects') {
        return `My new project! Presenting... ${post.title}`;
    }
    if (page.dir === 'blog') {
        return `My new article: '${post.title}'`;
    }
    return 'unintentional automated message definitely not from Ian Rackson';
};

const composeMessage = (page, post, subscriber) => {
    if (page.dir === 'projects') {
        return attachUnsubscribe(
            `<h1>Hi ${subscriber.first_name},</h1><br><h2>Please check out the new project I just posted!</h2><br><br><h3>Its called ${post.title}, and the <a href='${post.liveLink}'>live site</a> is up and running.<br><br>I would love for you to read more about the project on my <a href='${process.env.DOMAIN}/${page.dir}/${post.slug}'>personal website</a>.<br><br>Or, if you are just interested in the code, here's a link to the <a href='${post.codeLink}'>github repo</a>.<br><br>Just to give you an idea of what the project is about, here is a brief description of ${post.title}:<br><br><em>${post.description}</em></h3><br><br><h2>Thanks so much for subscribing to my automated portfolio distribution list!</h2><br><h4>Best,<br>Ian Rackson</h4>`,
            subscriber.email,
            page.dir
        );
    }
    if (page.dir === 'blog') {
        return attachUnsubscribe(
            `<h1>Hi ${subscriber.first_name},</h1><br><h2>Please check out my latest blog post!</h2><br><br><h3>Its titled '${post.title}', and you can read it now on my <a href='${process.env.DOMAIN}/${page.dir}/${post.slug}'>personal website</a>.<br><br>Just to give you an idea of what the article is about, here is a brief description:<br><br><em>${post.description}</em></h3><br><br><h2>Thanks so much for subscribing to my automated blog distribution list!</h2><br><h4>Best,<br>Ian Rackson</h4>`,
            subscriber.email,
            page.dir
        );
    }

    return '<h3>Please ignore this email as I have no idea why it was sent. Clearly, someone still have some work to do on his/her personal website.</h3><br><br><h4>Thanks and sorry,<br>- definitely not Ian Rackson</h4>';
};

const composeWelcomeMessage = (contentType, firstName, recipient) => {
    return attachUnsubscribe(
        `<h1>Hi ${firstName},</h1><br><br><h2>Thank you so much for subscribing to my ${contentType} distribution list.</h2><br><br><h4>Best,<br>Ian Rackson</h4>`,
        recipient,
        contentType
    );
};

const attachUnsubscribe = (messageBody, recipient, contentType) => {
    const styleBreak = '<br><br><br><br><br><hr>';
    const unsubLink = `${process.env.DOMAIN.slice(
        0,
        8
    )}api.${process.env.DOMAIN.slice(
        8
    )}/users/unsubscribe/address=${recipient}&content=${contentType}`;

    const content =
        contentType === 'projects' ? 'portfolio project' : 'blog post';

    return (
        messageBody +
        styleBreak +
        `<h5>If you would no longer like to receive a email every time I add a new ${content} to my website, you may <a href='${unsubLink}'>unsubscribe here</a></5>`
    );
};

const sendSub = async (page, post) => {
    //! get data
    const subs = await Sub.find({}).populate({
        path: 'contentType',
    });
    const confirmedSubscribers = subs
        .filter((e) => e.contentType.dir === page.dir)[0]
        .subscribers.filter((e) => e.confirmation);

    for (let i = 0; i < confirmedSubscribers.length; i++) {
        //! send email to each confirmedSubscriber
        const mailOptions = {
            from: `Ian Rackson <${process.env.MAILGUN_FROM}>`,
            to: confirmedSubscribers[i].email,
            subject: composeSubject(page, post),
            html: composeMessage(page, post, confirmedSubscribers[i]),
        };

        try {
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(
                        `failed distribution to ${confirmedSubscribers[i].email}`
                    );
                    console.log(err);
                } else {
                    console.log(
                        `successful distribution ${confirmedSubscribers[i].email}`
                    );
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    return true;
};

const sendWelcome = async (contentType, firstName, recipient) => {
    //! send email
    const content = contentType === 'projects' ? 'project post' : 'blog post';

    const mailOptions = {
        from: `Ian Rackson <${process.env.MAILGUN_FROM}>`,
        to: recipient,
        bcc: 'ian@rackson.com',
        subject: `You are signed up for new ${content} alerts!`,
        html: composeWelcomeMessage(contentType, firstName, recipient),
    };

    try {
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log('Mail error: ', err);
                return false;
            } else {
                console.log(
                    `welcome to ${contentType} successfully sent to ${recipient}`
                );
                return true;
            }
        });
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
};

const doUnsubscribe = async (contentType, subscriberEmail) => {
    const subs = await Sub.find({}).populate({
        path: 'contentType',
    });

    for (let i = 0; i < subs.length; i++) {
        if (subs[i].contentType.dir === contentType) {
            subs[i].subscribers = subs[i].subscribers.filter(
                (e) => e.email !== subscriberEmail
            );

            try {
                await subs[i].save();
                return {
                    success: `the email address ${subscriberEmail} will not receive notifications related to my ${contentType}`,
                };
            } catch (error) {
                console.log(error);
                return { failure: error };
            }
            continue;
        }
    }

    return {
        message: `the email address specified (${subscriberEmail}) was not found to be in the ${contentType} mailing list`,
    };
};

module.exports = { sendSub, sendWelcome, doUnsubscribe };
