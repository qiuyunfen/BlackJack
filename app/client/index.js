var clientOp = require('./js/clientOp'),
	event = require('./js/event'),
	config = require('../common/config'),
	state = require('../common/state');

require('./js/lib/resize');
require('./sass/index.scss');

var socket = io.connect('ws://localhost:' + config.port);

clientOp.init(socket);
event.init(socket, clientOp);
