'use strict';
require('../common');

process.kill(process.pid, 'SIGUSR2');
