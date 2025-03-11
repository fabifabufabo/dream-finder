const axios = require("axios");
const config = require('../../../config.json');

async function request(jobName, limit, options = {}) {
  const { remote = false, location } = options;
  let url = config.searchSettings.gupy.baseUrl + `?jobName=${jobName}&limit=${limit}`;

  if (remote) {
    url += "&workplaceType=remote";
  } else if (location) {
    url += `&city=${encodeURIComponent(location.city)}&state=${encodeURIComponent(location.state)}`;
  }

  try {
    const response = await axios.get(url);
    return response.data?.data || [];
  } catch (error) {
    console.error(`Erro ao buscar ${jobName}:`, error.message);
    return [];
  }
}

async function getRequests(jobList, options = {}) {
  const arr = [];
  for (const jobName of jobList) {
    const response = await request(jobName, config.searchSettings.gupy.apiLimit, options);
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
