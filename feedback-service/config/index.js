const path = require('path');

const bunyan = require('bunyan');
// Load package.json
const pjs = require('../package.json');

// Get some meta info from the package.json
const { name, version } = pjs;

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options for different environments
module.exports = {
  development: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'debug'),
    data: {
      feedback: path.join(__dirname, '../data/feedback.json'),
    },
    serviceregistry: {
      ip: "localhost",
      port: "3080",
    },
    appInsight: {
      disabled: true,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    }, 
  },
  production: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'info'),
    data: {
      feedback: path.join(__dirname, '../data/feedback.json'),
    },
    serviceregistry: {
      ip: "node-ms-feedbackservice.azurewebsites.net",
      port: "443",
    },
    appInsight: {
      disabled: false,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    }, 
  },
  test: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'fatal'),
    data: {
      speakers: path.join(__dirname, '../data/speakers.json'),
    },
    serviceregistry: {
      ip: "localhost",
      port: "3080",
    },
    appInsight: {
      disabled: true,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    }, 
  },
};
