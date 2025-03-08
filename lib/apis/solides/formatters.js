const config = require('../../../config.json');

function compare(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt);
}

function selectFields(job) {
  const selected = {};
  config.outputSettings.fields.solides.forEach(field => {
    selected[field] = job[field];
  });
  return selected;
}

module.exports = { compare, selectFields };
