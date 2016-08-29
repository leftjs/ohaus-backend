var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
import mongoose from 'mongoose'
import config from './config'

var routes = require('./routes/index');
var users = require('./routes/users');
import product from './routes/product'
import cors from 'cors'
import fallback from 'express-history-api-fallback'

var app = express();
// 全局变量
global.db = mongoose.connect(config.db_uri)
// 自定义异常
global.customError = (status, msg) => {
	if(typeof status == 'string') {
		msg = status
		status = null
	}
	var error = new Error(msg || '未知异常')
	error.status = status || 500
	return error
}
mongoose.Promise = global.Promise

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);
app.use('/api/users', users);
app.use('/api/product', product)

app.get('/', (req,res,next) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

const root = path.resolve(__dirname, 'public')
app.use('/*', fallback('index.html', {root}))




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
