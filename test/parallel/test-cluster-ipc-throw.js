'use strict';
const common = require('../common');
const http = require('http');
const cluster = require('cluster');

const server = http.createServer();
if (cluster.isMaster) {
  server.listen(common.PORT);
  const worker = cluster.fork();
  worker.on('exit', common.mustCall(() => {
    server.close();
  }));
} else {
  process.on('uncaughtException', common.mustCall((e) => {
  }));

  server.listen(common.PORT);
  server.on('error', common.mustCall((e) => {
    cluster.worker.disconnect();
    throw e;
  }));
}
