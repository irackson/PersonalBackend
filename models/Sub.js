//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const SubSchema = new Schema(
    {
        contentType: {
            type: Schema.Types.ObjectId,
            ref: 'Nav',
            required: true,
        },
        subscribers: {
            type: [
                {
                    first_name: { type: String },
                    email: { type: String, required: true },
                    confirmation: { type: Boolean, default: false },
                    account: { type: Schema.Types.ObjectId, ref: 'User' },
                },
            ],
            active: { type: Boolean, default: false },
            default: [],
        },
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
