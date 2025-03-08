const config = require('../../../config.json');

function compare(a, b) {
  return new Date(b.publishedDate) - new Date(a.publishedDate);
}

function selectFields(job) {
  const selected = {};
  config.outputSettings.fields.gupy.forEach(field => {
    selected[field] = job[field];
  });
  return selected;
}

module.exports = { compare, selectFields };
