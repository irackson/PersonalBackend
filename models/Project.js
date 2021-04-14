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

const ProjectSchema = new Schema(
    {
        title: { type: String, required: true },
        liveLink: { type: String, required: true },
        codeLink: { type: String, default: 'https://github.com/irackson' },
        description: { type: String, required: true },
        tags: { type: [String], required: true },
        visible: { type: Boolean, default: false },
        markdown: { type: String, required: true },
        featured: { type: Boolean, default: false },
        thumbnail: {
            type: String,
            default:
                'https://www.clipartmax.com/png/middle/317-3174648_web-programming-icon-clipart-website-development-computer-web-programming-icon.png',
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

ProjectSchema.pre('validate', function (next) {
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

const Project = model('Project', ProjectSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = Project;
