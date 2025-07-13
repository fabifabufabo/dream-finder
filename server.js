const express = require('express');
const { gupyFetchAndProcessJobs } = require('./lib/apis/gupy/adapter');
const { solidesFetchAndProcessJobs } = require('./lib/apis/solides/adapter');
const config = require('./config.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/jobs', async (req, res) => {
  try {
    const {
      jobSearchTerms = config.jobSearchTerms,
      locations = config.locations,
      enableRemote = true,
      platforms = ['gupy', 'solides'],
      excludedTerms = config.excludedTerms
    } = req.query;

    // Parse query parameters
    const searchTerms = typeof jobSearchTerms === 'string'
      ? jobSearchTerms.split(',').map(term => term.trim())
      : Array.isArray(jobSearchTerms) ? jobSearchTerms : config.jobSearchTerms;

    const searchLocations = typeof locations === 'string'
      ? JSON.parse(locations)
      : Array.isArray(locations) ? locations : config.locations;

    const isRemoteEnabled = enableRemote === 'true' || enableRemote === true;

    const selectedPlatforms = typeof platforms === 'string'
      ? platforms.split(',').map(p => p.trim())
      : Array.isArray(platforms) ? platforms : ['gupy', 'solides'];

    const parsedExcludedTerms = typeof excludedTerms === 'string'
      ? excludedTerms.split(',').map(term => term.trim())
      : Array.isArray(excludedTerms) ? excludedTerms : config.excludedTerms;

    const apis = [];

    // Add enabled APIs based on query parameters
    if (selectedPlatforms.includes('gupy') && config.searchSettings.gupy.enabled) {
      apis.push({
        name: 'gupy',
        fetcher: gupyFetchAndProcessJobs
      });
    }

    if (selectedPlatforms.includes('solides') && config.searchSettings.solides.enabled) {
      apis.push({
        name: 'solides',
        fetcher: solidesFetchAndProcessJobs
      });
    }

    // Temporarily override remote settings if needed
    const originalGupyRemote = config.searchSettings.gupy.enableRemote;
    const originalSolidesRemote = config.searchSettings.solides.enableRemote;
    const originalExcludedTerms = config.excludedTerms;

    config.searchSettings.gupy.enableRemote = isRemoteEnabled;
    config.searchSettings.solides.enableRemote = isRemoteEnabled;
    config.excludedTerms = parsedExcludedTerms;

    const jobsResults = await Promise.all(
      apis.map(async ({ name, fetcher }) => {
        try {
          const jobs = await fetcher(searchTerms, searchLocations);
          return { platform: name, jobs, count: jobs.length };
        } catch (error) {
          console.error(`Erro ao buscar vagas da API ${name}:`, error.message);
          return { platform: name, jobs: [], count: 0, error: error.message };
        }
      })
    );

    // Restore original settings
    config.searchSettings.gupy.enableRemote = originalGupyRemote;
    config.searchSettings.solides.enableRemote = originalSolidesRemote;
    config.excludedTerms = originalExcludedTerms;

    const totalJobs = jobsResults.reduce((sum, result) => sum + result.count, 0);

    res.json({
      success: true,
      totalJobs,
      results: jobsResults,
      searchParams: {
        jobSearchTerms: searchTerms,
        locations: searchLocations,
        enableRemote: isRemoteEnabled,
        platforms: selectedPlatforms,
        excludedTerms: parsedExcludedTerms
      }
    });

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Endpoint disponível: GET /jobs`);
});

module.exports = app;
