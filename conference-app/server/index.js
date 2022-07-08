let appInsights = require('applicationinsights');
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const configs = require('./config');
const Speakers = require('./services/Speakers');
const Feedback = require('./services/Feedback');
const routes = require('./routes');

const app = express();

const config = configs[app.get('env')];

appInsights.setup(`${config.appInsight.connectionString}`)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(false)
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
  .start();


const speakers = new Speakers(config);
const feedback = new Feedback(config);

app.set('view engine', 'pug');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
app.set('views', path.join(__dirname, './views'));
app.locals.title = config.sitename;


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use(async (req, res, next) => {
  try {
    const names = await speakers.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use('/', routes({
  speakers,
  feedback,
}));

app.use((req, res, next) => next(createError(404, 'File not found')));

// eslint-disable-next-line no-unused-vars
app.use( ( err, req, res ) => {
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(status);
  return res.render('error');
});


app.listen(config.port || 8080);

console.log(
  `Hi there! I'm listening on port ${config.port } in ${process.env.NODE_ENV} mode.`,
);

module.export = app;
