//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const BlogSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        tags: { type: [String], required: true },
        visible: { type: Boolean, default: false },
        markdown: { type: String, required: true },
        featured: { type: Boolean, default: false, unique: true },
        thumbnail: {
            type: String,
            default:
                'https://www.clipartmax.com/png/middle/105-1054200_summary-of-the-post-blog-icon-png.png',
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        sanitizedHtml: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

BlogSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }
});

///////////////////////////////////
//! DEFINE OUR MODEL
///////////////////////////////////

const Blog = model('Blog', BlogSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = Blog;
