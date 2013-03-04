//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var express = require('express');
var http = require('http');
var path = require('path');
var port = process.env.PORT || 8000;
var mongoose = require('mongoose');

var BetaSignUpApi = require('./api/betaSignUpApi.js');
var FeedbackApi = require('./api/FeedbackApi.js');


//-------------------------------------------------------------------------------
// Create Application
//-------------------------------------------------------------------------------

mongoose.connect('mongodb://localhost/airbug');

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


//-------------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------------

app.get('/', function(req, res){
    res.render('index', { title: 'airbug' });
    res.end();
});
app.post('/api/beta-sign-up', function(req, res){
    for(var property in req.body){
        console.log(property + ' : ' + req.body[property]);
    }

    var betaSignUpData = req.body;

    BetaSignUpApi.createBetaSignUp(betaSignUpData, function(error, betaSignUp) {
        var result = {
            success: false
        };
        if (error){
            console.log(new Error('betaSignUp failed to save'));
            result.error = error.message;
        } else {
            console.log('betaSignUp saved successfully: ' + betaSignUp.toString());
            result.success = true;
        }
        res.send(JSON.stringify(result));
        res.end();
    });
});
app.post('/api/feedback', function(req, res) {
    for(var property in req.body){
        console.log(property + ' : ' + req.body[property]);
    }

    var feedbackData = req.body;

    FeedbackApi.createFeedback(feedbackData, function(error, feedback) {
        var result = {
            success: false
        };
        if (error){
            console.log(new Error('feedback failed to save'));
            result.error = error.message;
        } else {
            console.log('feedback saved successfully: ' + feedback.toString());
            result.success = true;
        }
        res.send(JSON.stringify(result));
        res.end();
    });
});


//-------------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------------

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


