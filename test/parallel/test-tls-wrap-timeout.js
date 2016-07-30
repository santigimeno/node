'use strict';
var common = require('../common');
var assert = require('assert');

if (!common.hasCrypto) {
  common.skip('missing crypto');
  return;
}
var tls = require('tls');

var net = require('net');
var fs = require('fs');

var options = {
  key: fs.readFileSync(common.fixturesDir + '/keys/agent1-key.pem'),
  cert: fs.readFileSync(common.fixturesDir + '/keys/agent1-cert.pem')
};

var server = tls.createServer(options, common.mustCall((c) => {
  console.log('Server connected');
}));

server.listen(0, common.mustCall(() => {
  var socket = net.connect(server.address().port, function() {
    console.log('Client connected');
    var tsocket = tls.connect({
      socket: socket,
      rejectUnauthorized: false
    });
    tsocket.resume();
    setTimeout(common.mustCall(() => {
      tsocket.write('hello');
      setTimeout(common.mustCall(() => {
        tsocket.destroy();
        server.close();
      }), common.platformTimeout(150));
    }), common.platformTimeout(150));

    var s = socket.setTimeout(common.platformTimeout(240), function() {
      throw new Error('timeout');
    });
    assert.ok(s instanceof net.Socket);
  });
}));
