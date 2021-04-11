// the routes I want available in the nav bar

//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const NavSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        dir: { type: String, required: true, unique: true },
        visible: { type: Boolean, default: true },
        position: { type: Number, required: true, unique: true },
    },
    { timestamps: true }
);

///////////////////////////////////
//! DEFINE OUR MODEL
///////////////////////////////////

const Nav = model('Nav', NavSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = Nav;
