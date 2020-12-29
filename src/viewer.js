const path = require('path');
const fs = require('fs');
const http = require('http');

const WebSocket = require('ws');
const _ = require('lodash');
const express = require('express');
const ejs = require('ejs');
const opener = require('opener');
const mkdir = require('mkdirp');
const chalk = require('chalk');
const bfj = require('bfj-node4');
const filesize = require('filesize');

const Logger = require('./Logger');
const analyzer = require('./analyzer');
const { isCssFile } = require('./utils');
const initialMarkerChunks = require('./initialMarker/initialMarkerChunks');

const projectRoot = path.resolve(__dirname, '..');
const { bold } = chalk;

module.exports = {
  startServer,
  generateReport,
  generateJSONReport,
  // deprecated
  start: startServer
};

async function startServer(bundleStats, opts) {
  const {
    port = 8888,
    host = '127.0.0.1',
    openBrowser = true,
    bundleDir = null,
    logger = new Logger(),
    defaultSizes = 'parsed',
    excludeAssets = null
  } = opts || {};

  const analyzerOpts = { logger, excludeAssets };

  let chartData = getChartData(analyzerOpts, bundleStats, bundleDir);

  if (!chartData) return;

  const app = express();

  // Explicitly using our `ejs` dependency to render templates
  // Fixes #17
  app.engine('ejs', require('ejs').renderFile);
  app.set('view engine', 'ejs');
  app.set('views', `${projectRoot}/views`);
  app.use(express.static(`${projectRoot}/public`));

  app.use('/', (req, res) => {
    res.render('viewer', {
      mode: 'server',
      get chartData() {
        return JSON.stringify(chartData);
      },
      defaultSizes: JSON.stringify(defaultSizes)
    });
  });

  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(port, host, () => {
      resolve();

      const url = `http://${host}:${server.address().port}`;

      logger.info(
        `${bold('Webpack Bundle Analyzer')} is started at ${bold(url)}\n` +
          `Use ${bold('Ctrl+C')} to close it`
      );

      if (openBrowser) {
        opener(url);
      }
    });
  });

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('error', (err) => {
      // Ignore network errors like `ECONNRESET`, `EPIPE`, etc.
      if (err.errno) return;

      logger.info(err.message);
    });
  });

  return {
    ws: wss,
    http: server,
    updateChartData
  };

  function updateChartData(bundleStats) {
    const newChartData = getChartData(analyzerOpts, bundleStats, bundleDir);

    if (!newChartData) return;

    chartData = newChartData;

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: 'chartDataUpdated',
            data: newChartData
          })
        );
      }
    });
  }
}

function generateReport(bundleStats, opts) {
  const {
    openBrowser = true,
    reportFilename = 'report.html',
    bundleDir = null,
    logger = new Logger(),
    defaultSizes = 'parsed',
    excludeAssets = null
  } = opts || {};

  const chartData = getChartData(
    { logger, excludeAssets },
    bundleStats,
    bundleDir
  );

  if (!chartData) return;

  ejs.renderFile(
    `${projectRoot}/views/viewer.ejs`,
    {
      mode: 'static',
      chartData: JSON.stringify(chartData),
      assetContent: getAssetContent,
      defaultSizes: JSON.stringify(defaultSizes)
    },
    (err, reportHtml) => {
      if (err) return logger.error(err);

      const reportFilepath = path.resolve(
        bundleDir || process.cwd(),
        reportFilename
      );

      mkdir.sync(path.dirname(reportFilepath));
      fs.writeFileSync(reportFilepath, reportHtml);

      logger.info(
        `${bold('Webpack Bundle Analyzer')} saved report to ${bold(
          reportFilepath
        )}`
      );

      if (openBrowser) {
        opener(`file://${reportFilepath}`);
      }
    }
  );
}

async function generateJSONReport(bundleStats, opts) {
  const {
    openBrowser = true,
    reportFilename = 'report.json',
    bundleDir = null,
    logger = new Logger(),
    excludeAssets = null,
    initialLoadingResources = [],
    maxInitialLoadingSizeSingle = 100,
    maxInitialLoadingSizeBundle = 500,
    chunksLoadingResources = [],
    maxLazyLoadingSizeSingle = 100,
    maxLazyLoadingSizeBundle = 99999,
    initialResourcePrefix = 'Initial Loaded Resource : ',
    server = false,
    serverResourcePrefix = 'Server Resource : '
  } = opts || {};

  const viewerData = analyzer
    .getViewerData(bundleStats, bundleDir, {
      excludeAssets,
      logger
    })
    .map((item) => {
      const result = {
        label: item.label,
        parsedSize: filesize(item.parsedSize),
        gzipSize: filesize(item.gzipSize),
        chunkNames: item.chunkNames
      };

      if (!isCssFile(item.label)) {
        result.statSize = filesize(item.statSize);
      }

      return result;
    });

  const { report, budgetErrors } =
    (initialLoadingResources && initialLoadingResources.length) || server
      ? initialMarkerChunks(viewerData, {
        initialLoadingResources,
        maxInitialLoadingSizeSingle,
        maxInitialLoadingSizeBundle,
        chunksLoadingResources,
        maxLazyLoadingSizeSingle,
        maxLazyLoadingSizeBundle,
        initialResourcePrefix,
        server,
        serverResourcePrefix
      })
      : { report: viewerData, budgetErrors: [] };

  const reportFilepath = path.resolve(
    bundleDir || process.cwd(),
    reportFilename
  );

  mkdir.sync(path.dirname(reportFilepath));

  try {
    await bfj.write(reportFilepath, report, {
      space: 2,
      promises: 'ignore',
      buffers: 'ignore',
      maps: 'ignore',
      iterables: 'ignore',
      circular: 'ignore'
    });
  } catch (err) {
    return logger.error(err);
  }

  logger.info(
    `${bold('Webpack Bundle Analyzer')} saved report to ${bold(reportFilepath)}`
  );

  if (openBrowser) {
    opener(`file://${reportFilepath}`);
  }

  if (budgetErrors.length > 0) {
    return budgetErrors.map((el) => {
      const num = Number.parseFloat(el[2]).toFixed(2);
      return new Error(
        chalk`{bold {red FileSizeLimiter}: ${el[0]} {red ${el[1]}} exceeded size limit by {red ${num}KiB}}`
      );
    });
  }
}

function getAssetContent(filename) {
  return fs.readFileSync(`${projectRoot}/public/${filename}`, 'utf8');
}

function getChartData(analyzerOpts, ...args) {
  let chartData;
  const { logger } = analyzerOpts;

  try {
    chartData = analyzer.getViewerData(...args, analyzerOpts);
  } catch (err) {
    logger.error(`Could't analyze webpack bundle:\n${err}`);
    logger.debug(err.stack);
    chartData = null;
  }

  if (_.isPlainObject(chartData) && _.isEmpty(chartData)) {
    logger.error("Could't find any javascript bundles in provided stats file");
    chartData = null;
  }

  return chartData;
}
