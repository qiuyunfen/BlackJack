var express = require('express'),
	webpack = require('webpack'),
	webpackHotMiddleware = require('webpack-hot-middleware'),
	webpackDevMiddleware = require('webpack-dev-middleware'),
	path = require('path'),
	webpackConfig = require('./webpack.config'),
	config = require('./app/common/config'),
	serverOp = require('./app/server/serverOp');

var port = config.port;

var compiler = webpack(webpackConfig);
var devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    stats: {
        colors: true
    }
});
var hotMiddleware = webpackHotMiddleware(compiler);

var app = express();
app.use(devMiddleware);
app.use(hotMiddleware);

app.use('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'app/client/index.html'))
});
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(port, function() {
	console.log('server listening at port %d', port);
});

serverOp.init(io);
