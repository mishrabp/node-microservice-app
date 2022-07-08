

// Add your instrumentation key or use the APPLICATIONINSIGHTSKEY environment variable on your production machine to start collecting data.
var ai = require('applicationinsights');
ai.setup(process.env.APPLICATIONINSIGHTSKEY || 'your_instrumentation_key').start();const express = require('express');
const ServiceRegistry = require('./lib/ServiceRegistry')

const service = express();

module.exports = (config) => {
  const log = config.log();
  const serviceRegistry = new ServiceRegistry(log);
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.put("/register/:servicename/:serviceversion/:serviceip/:serviceport", (req, res) => {
    const {servicename, serviceversion, serviceip, serviceport} = req.params;

    const serviceKey = serviceRegistry
      .register(servicename,serviceversion,serviceip,serviceport);
    return res.json({result: serviceKey});
  });

  service.put("/register/:servicename/:serviceversion/:serviceport", (req, res) => {
    const {servicename, serviceversion, serviceport} = req.params;
    const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const serviceKey = serviceRegistry
      .register(servicename,serviceversion,serviceip,serviceport);
    return res.json({result: serviceKey});
  });

  service.delete("/unregister/:servicename/:serviceversion/:serviceip/:serviceport", (req, res) => {
    const {servicename, serviceversion, serviceip, serviceport} = req.params;

    const serviceKey = serviceRegistry
      .unregister(servicename,serviceversion,serviceip,serviceport);
    return res.json({result: serviceKey});
  });

  service.delete("/unregister/:servicename/:serviceversion/:serviceport", (req, res) => {
    const {servicename, serviceversion, serviceport} = req.params;
//    const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
    const serviceip = req.connection.remoteAddress;

    const serviceKey = serviceRegistry
      .unregister(servicename,serviceversion,serviceip,serviceport);
    return res.json({result: serviceKey});
  });

  service.get("/list", (req, res) => {
    const svc = serviceRegistry.list();
    if(!svc) return res.status(404).json({result: 'services not found'});
    return res.json(svc);
  });

  service.get("/find/:servicename/:serviceversion", (req, res) => {
    const {servicename, serviceversion} = req.params;
    const svc = serviceRegistry.get(servicename, serviceversion);
    if(!svc) return res.status(404).json({result: 'service not found'});
    return res.json(svc);
  });


  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
