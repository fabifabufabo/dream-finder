const config = require('../../../config.json');

function hasExcludedTerm(text) {
  const lowerText = text.toLowerCase();
  return config.excludedTerms.some(term => lowerText.includes(term.toLowerCase()));
}

function filterJob(job) {
  const title = job.title;
  if (hasExcludedTerm(title)) return false;

  if (config.searchSettings.solides.useExcludedTermsOnDescriptions === true) {
    const description = job.description;
    if (hasExcludedTerm(description)) return false;
  }

  return true;
}

module.exports = { filterJob };
