const Sub = require('../models/Sub');

const sendSub = async (page, post) => {
    const subs = await Sub.find({}).populate({
        path: 'contentType',
    });

    const sub = subs.filter((e) => e.contentType.dir === page.dir);
    console.log(sub[0]);

    // console.log(subs);
    // console.log(page);
    // console.log(post);
};

module.exports = { sendSub };
