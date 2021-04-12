//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const ServiceSchema = new Schema(
    {
        visible: { type: Boolean, default: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        availability: { type: Boolean, default: true },
        affiliates: [String],
    },
    { timestamps: true }
);

///////////////////////////////////
//! DEFINE OUR MODEL
///////////////////////////////////

const Service = model('Service', ServiceSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = Project;
