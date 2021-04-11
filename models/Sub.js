// admins will have access to editing things
// VIPs will have access to the VIP page --> there will be no way to become a VIP other than to contact me and pay outside of the website until that feature is integrated. once payment is made, I will go into the database and turn the paying user into a VIP

//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const SubSchema = new Schema(
    {
        contentType: { type: String, required: true },
        emails: [{ type: String, required: true }],
    },
    { timestamps: true }
);

///////////////////////////////////
//! DEFINE OUR MODEL
///////////////////////////////////

const Sub = model('Sub', SubSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = Sub;
