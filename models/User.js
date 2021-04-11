// admins will have access to editing things
// VIPs will have access to the VIP page --> there will be no way to become a VIP other than to contact me and pay outside of the website until that feature is integrated. once payment is made, I will go into the database and turn the paying user into a VIP

//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const UserSchema = new Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        admin: { type: Boolean, required: true },
        vip: { type: Boolean, default: false },
    },
    { timestamps: true }
);

///////////////////////////////////
//! DEFINE OUR MODEL
///////////////////////////////////

const User = model('User', UserSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = User;
