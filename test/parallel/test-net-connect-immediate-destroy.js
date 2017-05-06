'use strict';
const common = require('../common');
const net = require('net');

const s = net.createServer();
s.listen(0);
const port = s.address().port;
const socket = net.connect(0, common.localhostIPv4, common.mustNotCall());
socket.on('error', common.mustNotCall());
s.close();
socket.destroy();
