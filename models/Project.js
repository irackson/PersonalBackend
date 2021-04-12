//! Destructure Schema and model from our connected mongoose
const { Schema, model } = require('../db/connection');
const marked = require('marked');
const slugify = require('slugify');

///////////////////////////////////
//! DEFINE OUR SCHEMA
///////////////////////////////////

const ProjectSchema = new Schema(
    {
        visible: { type: Boolean, default: true },
        title: { type: String, required: true },
        codeLink: { type: String, default: 'https://github.com/irackson' },
        liveLink: { type: String, required: true },
        description: { type: String },
        markdown: { type: String, required: true },
        featured: { type: Boolean, default: false },
        thumbnail: { type: String, required: true },
        tags: [String],
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

ProjectSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
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
