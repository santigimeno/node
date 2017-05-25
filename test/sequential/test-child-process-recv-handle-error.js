'use strict';

const common = require('../common');
const assert = require('assert');
const net = require('net');
const cluster = require('cluster');
const spawn = require('child_process').spawn;

// Send handles from master to worker until the file descriptor limit is reached
// causing the recvmsg() syscall to return an ancillary reception error.

if (cluster.isMaster) {
  if (process.argv[2] === 'client') {
    const port = process.env.PORT;
    assert.ok(port);
    const connections = [];

    process.on('message', (message) => {
      assert.strictEqual(message, 'disconnect');
      connections.keys.forEach((conn) => {
        conn.destroy();
      });
    });

    function doConnect() {
      const conn = net.connect(port, () => {
        connections.push(conn);
        doConnect();
      });

      conn.on('error', common.noop);
    }

    doConnect();

    return;
  }

  let proc;
  const worker = cluster.fork();
  worker.on('exit', common.mustCall((code, signal) => {
    assert.strictEqual(code, 0);
    parentServer.close();
    proc.send('disconnect');
  }));

  const parentServer = net.createServer((conn) => {
    worker.send('connection', conn, common.mustCall());
  });

  parentServer.listen(0, common.mustCall(() => {
    proc = spawn(process.execPath, [__filename, 'client'], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      env: {
        PORT: parentServer.address().port
      }
    });
  }));
} else {
  process.on('message', (message, conn) => {
    assert.strictEqual(message, 'connection');
    if (conn)
      assert.ok(conn._handle);
    else
      process.disconnect();
  });
}
