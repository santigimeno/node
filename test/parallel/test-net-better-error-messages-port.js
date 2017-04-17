'use strict';
const common = require('../common');
const net = require('net');
const assert = require('assert');

const server = net.createServer();
server.listen(0);
const port = server.address().port;
server.close(() => {
  const c = net.createConnection(port);
  c.on('connect', common.mustNotCall());
  c.on('error', common.mustCall((e) => {
    assert.strictEqual(e.code, 'ECONNREFUSED');
    assert.strictEqual(e.port, port);
    assert.strictEqual(e.address, '127.0.0.1');
  }));
});
