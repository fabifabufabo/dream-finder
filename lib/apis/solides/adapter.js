const { fetchRemoteJobs, fetchLocalJobs } = require('./api.js');
const { compare, selectFields } = require('./formatters');
const { filterJob } = require('./filters');
const config = require('../../../config.json');

async function solidesFetchAndProcessJobs(jobNameList, locations) {
  let responses = [];

  if (config.searchSettings.solides.enableRemote) {
    const remoteJobs = await fetchRemoteJobs(jobNameList);
    responses.push(...remoteJobs);
  }

  if (config.searchSettings.solides.enableLocal && locations.length) {
    for (const location of locations) {
      const localJobs = await fetchLocalJobs(jobNameList, location);
      responses.push(...localJobs);
    }
  }

  responses.sort(compare);

  const uniqueJobs = new Set();
  const processed = responses.filter(job => {
    if (!uniqueJobs.has(job.id)) {
      uniqueJobs.add(job.id);
      return true;
    }
    return false;
  })
    .filter(filterJob)
    .map(selectFields);

  return processed;
}

module.exports = { solidesFetchAndProcessJobs };
