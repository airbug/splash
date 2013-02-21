
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , port = process.env.PORT || 8000
  , db = require('./db.js').db;

var routes = {};
var site = routes.site = require('./routes/site.js');
var betaSignUp = routes.betaSignUp = require('./routes/betaSignUp.js');

var app = express();

app.configure(function(){
  app.set('port', port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride()); // put and delete support for html 4 and older
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes 
app.get('/', site.index);
app.get('/home', site.index);
app.post('/beta-signup', betaSignUp.create);

// Graceful Shutdown
process.on('SIGTERM', function () {
  console.log("Server Closing");
  app.close();
});

app.on('close', function () {
  console.log("Server Closed");
  db.connection.close();
});

// Create Server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


