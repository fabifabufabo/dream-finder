const config = require('./config.json');
const { gupyFetchAndProcessJobs } = require('./lib/apis/gupy/adapter');
const { solidesFetchAndProcessJobs } = require('./lib/apis/solides/adapter');
const { saveData } = require('./lib/storage');

(async function () {
  try {
    const apis = [
      { name: 'Gupy', status: config.searchSettings.gupy.enabled, fetcher: gupyFetchAndProcessJobs },
      { name: 'Solides', status: config.searchSettings.solides.enabled, fetcher: solidesFetchAndProcessJobs }
    ];

    const jobsResults = await Promise.all(
      apis.map(async ({ name, status, fetcher }) => {
        if (!status) {
          console.log(`API ${name} desabilitada nas configurações.`);
          return { name, jobs: [] };
        }
        const jobs = await fetcher(config.jobSearchTerms, config.locations);
        console.log(`Obtidas ${jobs.length} vagas da API ${name}.`);
        return { name, jobs };
      })
    );

    let allJobs = {};

    jobsResults.forEach(({ name, jobs }) => {
      allJobs[name] = jobs;
    });

    const totalJobs = Object.values(allJobs).reduce((sum, jobs) => sum + jobs.length, 0);
    await saveData(config.outputSettings.fileName, allJobs);
    console.log(`JSON file has been saved with ${totalJobs} jobs from enabled APIs.`);
  } catch (error) {
    console.error("Erro no processamento:", error);
  }
})();
