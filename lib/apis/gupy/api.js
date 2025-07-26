const axios = require("axios");
const config = require('../../../config.json');

async function requestWithBackoff(url) {
  let delay = 1;
  while (delay < 120) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(`Request failed, retrying in ${delay}s...`, e.message);
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
      delay *= 2;
      delay += Math.random(); // Add jitter
    }
  }
  console.error(`Failed to fetch from ${url} after multiple retries.`);
  return null;
}

async function fetchJobsByKeyword(keyword, options = {}) {
  const { remote, location } = options;
  const allJobs = [];
  let offset = 0;

  while (true) {
    let baseUrl = config.searchSettings.gupy.baseUrl + `?jobName=${keyword}&offset=${offset}`;
    if (remote) {
      baseUrl += "&workplaceType=remote";
    } else if (location) {
      baseUrl += `&city=${encodeURIComponent(location.city)}&state=${encodeURIComponent(location.state)}`;
    }

    console.log(`Sending a request to ${baseUrl} with offset = ${offset} for keyword = ${keyword}`);
    const data = await requestWithBackoff(baseUrl);

    if (!data || !data.data || data.data.length === 0) {
      console.log(`No jobs found for ${keyword}.`);
      break;
    }

    allJobs.push(...data.data);

    offset += data.pagination.limit;
    if (offset > data.pagination.total) {
      console.log(`Limit of ${data.pagination.total} has been reached for ${keyword}.`);
      break;
    }
  }
  return allJobs;
}

module.exports = { fetchJobsByKeyword };
