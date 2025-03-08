const config = require('./config.json');
const { gupyFetchAndProcessJobs } = require('./lib/apis/gupy/adapter');
const { solidesFetchAndProcessJobs } = require('./lib/apis/solides/adapter');
const { saveData } = require('./lib/storage');

(async function () {
  try {
    let allJobs = {
      gupy: [],
      solides: []
    };

    if (config.searchSettings.gupy.enabled) {
      const gupyJobs = await gupyFetchAndProcessJobs(config.jobSearchTerms, config.locations);
      allJobs.gupy = gupyJobs;
      console.log(`Obtidas ${gupyJobs.length} vagas da API Gupy.`);
    } else {
      console.log("API Gupy desabilitada nas configurações.");
    }

    if (config.searchSettings.solides.enabled) {
      const solidesJobs = await solidesFetchAndProcessJobs(config.jobSearchTerms, config.locations);
      allJobs.solides = solidesJobs;
      console.log(`Obtidas ${solidesJobs.length} vagas da API Solides.`);
    } else {
      console.log("API Solides desabilitada nas configurações.");
    }

    await saveData(config.outputSettings.fileName, allJobs);
    console.log(`JSON file has been saved with ${allJobs.gupy.length + allJobs.solides.length} jobs from enabled APIs.`);
  } catch (error) {
    console.error("Erro no processamento:", error);
  }
})();
