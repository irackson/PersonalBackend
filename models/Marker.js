// shared by Resume and About

//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const MarkerSchema = new Schema(
    {
        heading: { type: String, required: true },
        content: { type: String, required: true },
        presentation: { type: String, required: true }, // 'ordered list', 'unordered list', 'paragraph'
    },
    { timestamps: true }
);

///////////////////////////////////
//! DEFINE OUR MODEL
///////////////////////////////////

const Marker = model('Marker', MarkerSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = Marker;
