# My Portfolio Website [![wakatime](https://wakatime.com/badge/github/irackson/PortfolioWebsite.svg)](https://wakatime.com/badge/github/irackson/PortfolioWebsite)

-   **Author:** Ian Rackson
-   **Link to Live Site:** https://ianrackson.herokuapp.com/

##

## Project Summary

-   This project serves as the backend of my personal website / portfolio / blog

##

## Technology Used

### Dependencies

-   [mongoose](https://www.npmjs.com/package/mongoose) (for [MongoDB](https://www.mongodb.com/) database operations)

-   [express](https://www.npmjs.com/package/express) / [express-session](https://www.npmjs.com/package/express-session) / [method-override](https://www.npmjs.com/package/method-override) / [cors](https://www.npmjs.com/package/cors)

-   [bcryptjs](https://www.npmjs.com/package/bcryptjs) / [dotenv](https://www.npmjs.com/package/dotenv)

-   [marked](https://www.npmjs.com/package/marked) / [dompurify](https://www.npmjs.com/package/dompurify) / [jsdom](https://www.npmjs.com/package/jsdom)

-   [slugify](https://www.npmjs.com/package/slugify)

-   [nodemailer](https://www.npmjs.com/package/nodemailer) / [nodemailer-mailgun-transport](https://www.npmjs.com/package/nodemailer-mailgun-transport)

### Workflow (Developer Dependencies)

-   VS Code tasks
-   [nodemon](https://www.npmjs.com/package/nodemon)

-   [gulp](https://www.npmjs.com/package/gulp) / [gulp-dart-sass](https://www.npmjs.com/package/gulp-dart-sass) / [gulp-concat](https://www.npmjs.com/package/gulp-concat) / [gulp-postcss](https://www.npmjs.com/package/gulp-postcss) / [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) / [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) / [autoprefixer](https://www.npmjs.com/package/autoprefixer) / [cssnano](https://www.npmjs.com/package/cssnano)

### Agile Project Management

-   [Trello](https://trello.com/invite/b/VVhnA2Ep/0b2b28bebd161fbfa902d7be50dd657b/porfoliowebsite) (for User Stories, Ice Box, Current/MVP, Completed)

-   [diagrams.net](https://app.diagrams.net/) (for Sitemap)

    ![](https://trello-attachments.s3.amazonaws.com/606ce72d6fdb47289f6c9435/607127033a4d7f62ea5be511/84a351a1738c1d36fa00bdb81bb0332d/5fg8Fwu.png)

-   [Figma](https://www.figma.com/file/ku3I4S26RbzT23bggfxzdV/Wireframes?node-id=0%3A1) (for Wireframes)

    Home page (desktop)

    ![](https://trello-attachments.s3.amazonaws.com/606ce72d6fdb47289f6c9435/60721c018daf1f42aa5e0c1a/c3a5c8f251c66b74f35a87ea05d4fe53/m1wOIYb.png)

    Home page (mobile)

    ![](https://trello-attachments.s3.amazonaws.com/606ce72d6fdb47289f6c9435/60721ce832b49e4061b9a8a7/289ec6f9e2d52827dfda39a170585795/lHAAfCz.png)

    Apps page (currently Projects)

    ![](https://trello-attachments.s3.amazonaws.com/606ce72d6fdb47289f6c9435/60721bbe55b5356d925fae6a/d72466e75483382d45cc81dbb313c2cd/LX8dFf9.png)

## Models

### User Model:

```javascript
const UserSchema = new Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        admin: { type: Boolean, required: true },
        vip: { type: Boolean, default: false },
    },
    { timestamps: true }
);
```

### Nav Model (Navigation):

```javascript
const NavSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        dir: { type: String, required: true, unique: true },
        visible: { type: Boolean, default: true },
        position: { type: Number, required: true },
    },
    { timestamps: true }
);
```

### Project Model:

(same as Blog Model but with liveLink and codeLink properties added)

```javascript
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
            default: 'relevant-stock-icon.png',
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
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }

    next();
});
```

### Sub Model (Subscription):

```javascript
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
```

## Route Maps

### Users ("/users")

| Method | Endpoint          | Resource/View                                         |
| ------ | ----------------- | ----------------------------------------------------- |
| GET    | "/create"         | Render form for new User (users/create.ejs)           |
| POST   | "/create"         | Uses Form Submission to Create new User               |
| GET    | "/login"          | Display a Particular Post (projects/show.ejs)         |
| POST   | "/login"          | Render form to User login  (projects/update.ejs)      |
| POST   | "/subscribe"      | Uses partials/footer.ejs Form Submission to Subscribe |
| GET    | "/unsubscribe/\*" | Render form to Unsubscribe  (users/unsubscribe.ejs)   |
| POST   | "/unsubscribe/\*" | Uses Form Submission to Unsubscribe                   |
| GET    | "/logout"         | Logout a particular User                              |
| GET    | "/\*"             | Catch-all redirect to "/" (home page)                 |

### Projects ("/projects")

| Method | Endpoint        | Resource/View                                   |
| ------ | --------------- | ----------------------------------------------- |
| GET    | "/"             | List all Posts (projects/index.ejs)             |
| GET    | "/create"       | Render form for New Post (projects/create.ejs)  |
| GET    | "/:slug"        | Display a Particular Post (projects/show.ejs)   |
| POST   | "/"             | Uses Form Submission to Create new Post         |
| GET    | "/:slug/update" | Render form to edit Post  (projects/update.ejs) |
| PUT    | "/:slug"        | Uses Form Submission to edit Post               |
| DELETE | "/:slug"        | Delete a particular Post                        |
| GET    | "/\*"           | Catch-all redirect to "/projects"               |

### Blog ("/blog<endpoint>")

| Method | Endpoint        | Resource/View                               |
| ------ | --------------- | ------------------------------------------- |
| GET    | "/"             | List all Posts (blog/index.ejs)             |
| GET    | "/create"       | Render form for New Post (blog/create.ejs)  |
| GET    | "/:slug"        | Display a Particular Post (blog/show.ejs)   |
| POST   | "/"             | Uses Form Submission to Create new Post     |
| GET    | "/:slug/update" | Render form to edit Post  (blog/update.ejs) |
| PUT    | "/:slug"        | Uses Form Submission to edit Post           |
| DELETE | "/:slug"        | Delete a particular Post                    |
| GET    | "/\*"           | Catch-all redirect to "/blog"               |

### Metrics ("/metrics")

| Method | Endpoint | Resource/View                          |
| ------ | -------- | -------------------------------------- |
| GET    | "/"      | List all Metrics ("metrics/index.ejs") |
| GET    | "/\*"    | Catch-all redirect to "/metrics"       |

### Resume ("/resume")

| Method | Endpoint    | Resource/View                           |
| ------ | ----------- | --------------------------------------- |
| GET    | "/"         | Render Resume page ("resume/index.ejs") |
| GET    | "/download" | Download Resume from public assets      |
| GET    | "/\*"       | Catch-all redirect to "/resume"         |

### Webmaster ("/webmaster")

| Method | Endpoint | Resource/View                                              |
| ------ | -------- | ---------------------------------------------------------- |
| GET    | "/"      | Render form for Sitewide Settings (webmaster/settings.ejs) |
| POST   | "/seed"  | Reseed the Database                                        |
| PUT    | "/"      | Uses Form Submission to edit Sitewide Settings             |
| GET    | "/\*"    | Catch-all redirect to "/webmaster"                         |

## Challenges

-   Too many to count!

## Existing Bugs

-   There are over nine hundred thousand different different species of bugs

## Notes

-   to render code in markdown properly with prism, you must use this pattern:

    `<pre><code class="language-css">p { color: red }</code></pre>`
