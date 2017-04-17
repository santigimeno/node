'use strict';
const common = require('../common');
const net = require('net');

const s = net.createServer();
s.listen(0);
const port = s.address().port;
s.close(() => {
  const socket = net.connect(port, common.localhostIPv4, common.mustNotCall());
  socket.on('error', common.mustNotCall());
  socket.destroy();
});
