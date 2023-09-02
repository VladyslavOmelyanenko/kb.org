const slugify = require("slugify");

module.exports = {
  beforeCreate({ params }) {
    const { data } = params;

    if (data.title) {
      data.slug = slugify(data.title, { lower: true });
    }
  },
  beforeUpdate({ params }) {
    const { data } = params;

    if (data.title) {
      data.slug = slugify(data.title, { lower: true });
    }
  },
};