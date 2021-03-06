const getExistingTags = async (Model, admin) => {
    let existingTags = [];
    const blogsWithTags = admin
        ? await Model.find({ tags: { $ne: ['other'] } }, 'tags -_id')
        : await Model.find(
              { tags: { $ne: ['other'] }, visible: true },
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
