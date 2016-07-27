'use strict';
require('../common');

process.kill(process.pid, 'SIGHUP');
