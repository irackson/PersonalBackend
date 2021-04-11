//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');
const marked = require('marked');
const slugify = require('slugify');

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const BlogSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        markdown: { type: String, required: true },
        featured: { type: Boolean, default: false },
        thumbnail: { type: String },
        tags: [String],
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

BlogSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

///////////////////////////////////
//! DEFINE OUR MODEL
///////////////////////////////////

const Blog = model('Blog', BlogSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = Blog;
