const slugify = require("slugify");

module.exports = {
  beforeCreate({ params }) {
    const { data } = params;

    if (data.fullName) {
      data.slug = slugify(data.fullName, { lower: true });
    }
  },
  beforeUpdate({ params }) {
    const { data } = params;

    if (data.fullName) {
      data.slug = slugify(data.fullName, { lower: true });
    }
  },
};