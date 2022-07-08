const bunyan = require('bunyan');
const path = require('path')
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
    ipaddress: "localhost",
    port: "8080",
    data: {
      images: path.join(__dirname, '../data/images'),
      speakers: path.join(__dirname, '../data/speakers.json'),
    },
    serviceregistry: {
      ip: "node-ms-serviceregistry.azurewebsites.net",
      port: "443",
      protocol: "https",
    },
    appInsight: {
      disabled: true,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    }, 
    log: () => getLogger(name, version, 'debug'),
  },
  production: {
    name,
    version,
    serviceTimeout: 30,
    ipaddress: "node-ms-speakerservice.azurewebsites.net",
    port: "443",
    data: {
      images: path.join(__dirname, '../data/images'),
      speakers: path.join(__dirname, '../data/speakers.json'),
    },
    serviceregistry: {
      ip: "node-ms-serviceregistry.azurewebsites.net",
      port: "443",
      protocol: "https",
    },
    appInsight: {
      disabled: false,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    }, 
    log: () => getLogger(name, version, 'info'),
  },
  test: {
    name,
    version,
    serviceTimeout: 30,
    ipaddress: "node-ms-speakerservice.azurewebsites.net",
    port: "443",
    data: {
      images: path.join(__dirname, '../data/images'),
      speakers: path.join(__dirname, '../data/speakers.json'),
    },
    serviceregistry: {
      ip: "localhost",
      port: "3080",
      protocol: "http",
    },
    appInsight: {
      disabled: true,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    }, 
    log: () => getLogger(name, version, 'fatal'),
  },
};
