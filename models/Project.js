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
        previouslySent: { type: Boolean, default: false },
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

    if (this.markdown) {
        // this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));

        //* less secure without dompurify, but necessary for Youtube embed to parse iframe script
        //? https://stackoverflow.com/questions/60299226/how-to-allow-an-iframe-tag-in-dompurify-including-all-of-its-attributes

        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown), {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
        });
    }

    next();
});

///////////////////////////////////
//! DEFINE OUR MODEL
///////////////////////////////////

const Project = model('Project', ProjectSchema);

///////////////////////////////////
//! Export Our Model
///////////////////////////////////

module.exports = Project;
