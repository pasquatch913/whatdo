var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
/*
var yelpRequest = require('./yelpRequest0');
var setParams = {
    location: 'New+York',
    sort: '2'
  };
*/

var routes = require('./app_server/routes/index.js');

var app = express();

// i don't know what this does
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// or this really. i think this sets up some stuff
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// this contains some routes.
app.use('/', routes);
/*app.post('/', function (req, res) {
  res.get('http://innovid.com');
});*/


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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// this exports the express app. don't think this is used
module.exports = app;
/*
yelpRequest.request_yelp(setParams, function (err, res, data) {
  console.log(JSON.parse(data).total);
});*/
