const axios = require("axios");
const config = require('../../../config.json');

async function request(jobName, resultsPerPage, options = {}) {
  const { remote = false, location } = options;
  let url = config.searchSettings.solides.baseUrl + `?page=1&title=${encodeURIComponent(jobName)}&take=${resultsPerPage}`;

  if (remote) {
    url += "&jobsType=remoto";
  } else if (location) {
    const formattedLocation = `${encodeURIComponent(location.city)}+-+${encodeURIComponent(location.stateCode)}`;
    url += `&locations=${formattedLocation}`;
  }

  try {
    const response = await axios.get(url);
    if (response.data && response.data.success && response.data.data && response.data.data.data) {
      return response.data.data.data;
    }
    return [];
  } catch (error) {
    console.error(`Erro ao buscar ${jobName}:`, error.message);
    return [];
  }
}

async function getRequests(jobList, options = {}) {
  const arr = [];
  for (const jobName of jobList) {
    const response = await request(jobName, config.searchSettings.solides.resultsPerPage, options);
    arr.push(...response);
  }
  return arr;
}

async function fetchRemoteJobs(jobList) {
  return getRequests(jobList, { remote: true });
}

async function fetchLocalJobs(jobList, location) {
  return getRequests(jobList, { location });
}

module.exports = { fetchRemoteJobs, fetchLocalJobs };
