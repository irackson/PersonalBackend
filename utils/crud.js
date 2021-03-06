const editsToPost = async (Model, edits, post, repeatPrefix) => {
    edits.tags = edits.tags ? edits.tags.split(',').map((e) => e.trim()) : [];
    for (property in edits) {
        if (property.substring(0, repeatPrefix.length) === repeatPrefix) {
            edits.tags.push(property.split('=').pop());
            edits[property] = undefined;
            continue;
        }
        if (edits[property] === '') {
            edits[property] = undefined;
            continue;
        }
    }
    edits.visible = edits.visible ? true : false;

    if (edits.featured) {
        await Model.updateMany(
            { slug: { $ne: post.slug } },
            { featured: false }
        );
        edits.featured = true;
    } else {
        edits.featured = false;
    }

    for (property in edits) {
        if (typeof edits[property] !== 'undefined') {
            post[property] = edits[property];
        }
    }

    return new Promise(function (myResolve) {
        myResolve(post);
    });
};

module.exports = { editsToPost };
