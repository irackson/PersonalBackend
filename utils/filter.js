const getExistingTags = async (Model) => {
    let existingTags = [];

    const blogsWithTags = await Model.find(
        { tags: { $ne: ['other'] } },
        'tags -_id'
    );
    for (let b = 0; b < blogsWithTags.length; b++) {
        blogsWithTags[b]['tags'].forEach((t) => {
            if (!existingTags.includes(t)) {
                existingTags.push(t);
            }
        });
    }

    return new Promise(function (myResolve) {
        myResolve(existingTags);
    });
};

module.exports = { getExistingTags };
