/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');
const express = require('express')
const fallback = require('express-history-api-fallback')
const path = require('path')

// new WebpackDevServer(webpack(config), config.devServer)
// .listen(config.port, 'localhost', (err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log('Listening at localhost:' + config.port);
//   console.log('Opening your system browser...');
//   open('http://localhost:' + config.port + '/webpack-dev-server/');
// });



var compiler = webpack(config)
var app = express()
app.use(require('webpack-dev-middleware')(compiler, {
	lazy: false,
	noInfo: true,
	publicPath: config.output.publicPath,
	quiet: false,
	stats: config.compiler.stats
}))

app.use(require('webpack-hot-middleware')(compiler))

app.get('/', function(req,res) {
	res.sendFile(path.resolve(__dirname, 'src', 'index.html'))
})

app.use(express.static('/assets'));
app.use('/*', fallback(path.resolve(__dirname, 'src', 'index.html')))




var port = config.port;
var hostname = 'localhost';

app.listen(port, hostname, (err) => {
	if (err) {
		return;
	}
	console.log(`Server is now running at http://${hostname}:${port}.`);
});


open('http://localhost:' + port);

