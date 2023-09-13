const slugify = require("slugify");

module.exports = {
  async beforeCreate({ params }) {
    const { data } = params;

    if (data.fullName) {

      if (data.locale == 'en') {
        data.slug = slugify(data.fullName, { lower: true });
      }
    }
  },
  async beforeUpdate({ params }) {
    const { data } = params;
    // console.log(data);

    if (data.fullName) {
      // Fetch the existing content from the database

        const project = await strapi.service('api::participant.participant').findOne(data.id);
        const locale = project.locale;

        if (locale == 'en') {
          data.slug = slugify(data.fullName, { lower: true });
        }
    }
  },
};
