const { fetchJobsByKeyword } = require('./api');
const { compare, selectFields } = require('./formatters');
const { filterJob } = require('./filters');
const config = require('../../../config.json');

async function gupyFetchAndProcessJobs(jobNameList, locations) {
  let responses = [];

  for (const jobName of jobNameList) {
    if (config.searchSettings.gupy.enableRemote) {
      const remoteJobs = await fetchJobsByKeyword(jobName, { remote: true });
      responses.push(...remoteJobs);
    }

    if (config.searchSettings.gupy.enableLocal && locations.length) {
      for (const location of locations) {
        const localJobs = await fetchJobsByKeyword(jobName, { location });
        responses.push(...localJobs);
      }
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

module.exports = { gupyFetchAndProcessJobs };
