const slugify = require("slugify");

module.exports = {
  async beforeCreate({ params }) {
    const { data } = params;

    if (data.title) {

      if (data.locale == 'en') {
        data.slug = slugify(data.title.replace(/:/g, '-'), { lower: true });
      }
    }
  },
  async beforeUpdate({ params }) {
    const { data } = params;

    if (data.title) {
      // Fetch the existing content from the database

        const venue = await strapi.service('api::venue.venue').findOne(data.id);
        const locale = venue.locale;

        if (locale == 'en') {
          data.slug = slugify(data.title.replace(/:/g, '-'), { lower: true });
        }
    }
  },
};
