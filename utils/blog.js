const editsToBlog = async (edits, blog, repeatPrefix) => {
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
    edits.featured = edits.featured ? true : false;

    for (property in edits) {
        if (typeof edits[property] !== 'undefined') {
            blog[property] = edits[property];
        }
    }

    return new Promise(function (myResolve) {
        myResolve(blog);
    });
};

module.exports = { editsToBlog };
