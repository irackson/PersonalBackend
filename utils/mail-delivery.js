// Await provider completion before a Vercel request is allowed to finish.
const deliverMail = async (transporter, options) => {
    await transporter.sendMail(options);
    return true;
};

module.exports = { deliverMail };
