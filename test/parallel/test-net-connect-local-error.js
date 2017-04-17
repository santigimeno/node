'use strict';
const common = require('../common');
const assert = require('assert');
const net = require('net');

const s = net.createServer();
s.listen(0);
const port = s.address().port;
s.close(() => {
  const client = net.connect({
    port: port + 1,
    localPort: port,
    localAddress: common.localhostIPv4
  });

  client.on('error', common.mustCall(function onError(err) {
    assert.strictEqual(
      err.localPort,
      port,
      `${err.localPort} !== ${port} in ${err}`
    );
    assert.strictEqual(
      err.localAddress,
      common.localhostIPv4,
      `${err.localAddress} !== ${common.localhostIPv4} in ${err}`
    );
  }));
});
