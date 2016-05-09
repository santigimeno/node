'use strict';
const common = require('../common');
const assert = require('assert');
const spawn = require('child_process').spawn;

var buffer = '';

// connect to debug agent
var interfacer = spawn(process.execPath, ['debug', '-p', '655555']);

console.error(process.execPath, 'debug', '-p', '655555');
interfacer.stdout.setEncoding('utf-8');
interfacer.stderr.setEncoding('utf-8');
var onData = function(data) {
  data = (buffer + data).split('\n');
  buffer = data.pop();
  data.forEach(function(line) {
    interfacer.emit('line', line);
  });
};
interfacer.stdout.on('data', onData);
interfacer.stderr.on('data', onData);

interfacer.on('line', function(line) {
  if (common.isWindows) {
    console.error(line);
  } else {
    line = line.replace(/^(debug> *)+/, '');
    var pid = interfacer.pid;
    var expected = `(node:${pid}) Target process: 655555 doesn\'t exist.`;
    assert.strictEqual(expected, line);
  }
});

interfacer.on('exit', function(code, signal) {
  assert.ok(code == 1, 'Got unexpected code: ' + code);
  if (common.isWindows) {
    throw new Error('TESTING');
  }
});
