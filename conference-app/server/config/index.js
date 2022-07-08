module.exports = {
  development: {
    sitename: 'Roux Meetups [Development]',
    serviceRegistry: {
      url: 'https://node-ms-serviceregistry.azurewebsites.net',
      versionIdentifier: "1.x.x",
      serviceRegistryProtocol: "https",
      serviceProtocol: "https",
    },
    appInsight: {
      disabled: true,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    },
    port: 8081, 
  },
  test: {
    sitename: 'Roux Meetups [Test]',
    serviceRegistry: {
      url: 'http://localhost:3080',
      versionIdentifier: "1.x.x",
      serviceRegistryProtocol: "http",
      serviceProtocol: "http",
    },
    appInsight: {
      disabled: true,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    }, 
    port: 8080, 
  },
  production: {
    sitename: 'Roux Meetups',
    serviceRegistry: {
      url: 'https://node-ms-serviceregistry.azurewebsites.net',
      versionIdentifier: "1.x.x",
      serviceRegistryProtocol: "https",
      serviceProtocol: "https",
    },
    appInsight: {
      disabled: false,
      connectionString: "InstrumentationKey=0bde1037-3aa3-4d11-bf82-60d8ce95eb2d;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/"
    }, 
    port: 8080, 
  },
};
