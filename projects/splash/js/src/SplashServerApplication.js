//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('SplashServerApplication')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('configbug.Configbug')
//@Require('splash.BetaSignupApi')
//@Require('splash.FeedbackApi')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context(module);
var express                 = require('express');
var http                    = require('http');
var path                    = require('path');
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugFs                   = bugpack.require('bugfs.BugFs');
var Configbug               = bugpack.require('configbug.Configbug');
var BetaSignUpApi           = bugpack.require('splash.BetaSignUpApi');
var FeedbackApi             = bugpack.require('splash.FeedbackApi');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SplashServerApplication = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        //TODO BRN: Update this application to use bugioc so we can inject this stuff

        /**
         * @private
         * @type {BetaSignUpApi}
         */
        this.betaSignupApi      = new BetaSignUpApi();

        /**
         * @private
         * @type {Configbug}
         */
        this.configbug          = new Configbug(BugFs.resolvePaths([__dirname, '../resources/config']));

        /**
         * @private
         * @type {FeedbackApi}
         */
        this.feedbackApi        = new FeedbackApi();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    start: function(callback) {


        //-------------------------------------------------------------------------------
        // Create Application
        //-------------------------------------------------------------------------------

        var _this       = this;
        /** @type {string} */
        var configName  = this.generateConfigName();
        /** @type {Config} */
        var config      = null;

        $series([
            $task(function(flow) {
                _this.loadConfig(configName, function(throwable, loadedConfig) {
                    if (!throwable) {
                        config = loadedConfig;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                mongoose.connect('mongodb://' + config.getProperty("mongoDbIp") + '/airbug');

                _this.betaSignupApi.setConfig(config);
                var app = express();

                app.configure(function(){
                    app.use(function (req, res, next) {
                        res.removeHeader("X-Powered-By");
                        next();
                    });
                    app.set('port', config.getProperty("port"));
                    app.set('views', path.resolve(__dirname, '../resources/views'));
                    app.set('view engine', 'jade');
                    app.use(express.logger('dev'));
                    app.use(express.bodyParser());
                    app.use(express.methodOverride()); // put and delete support for html 4 and older
                    app.use('/static', express.static(path.resolve(__dirname, '../static')));
                    app.use(app.router);
                });

                app.configure('development', function(){
                    app.use(express.errorHandler());
                });


                //-------------------------------------------------------------------------------
                // Routes
                //-------------------------------------------------------------------------------

                app.get('/', function(req, res){
                    res.render('index', {
                        title: 'airbug',
                        production: config.getProperty("production"),
                        staticUrl: config.getProperty("staticUrl")
                    });
                    res.end();
                });
                app.get('/terms', function(req, res){
                    res.render('terms', {
                        title: 'airbug',
                        production: config.getProperty("production"),
                        staticUrl: config.getProperty("staticUrl")
                    });
                    res.end();
                });
                app.get('/privacy', function(req, res){
                    res.render('privacy', {
                        title: 'airbug',
                        production: config.getProperty("production"),
                        staticUrl: config.getProperty("staticUrl")
                    });
                    res.end();
                });
                app.post('/splash/api/beta-sign-up', function(req, res){
                    for(var property in req.body){
                        console.log(property + ' : ' + req.body[property]);
                    }

                    var betaSignUpData = req.body;

                    _this.betaSignupApi.createBetaSignUp(betaSignUpData, function(error, betaSignUp) {
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
                app.post('/splash/api/feedback', function(req, res) {
                    for(var property in req.body){
                        console.log(property + ' : ' + req.body[property]);
                    }

                    var feedbackData = req.body;

                    _this.feedbackApi.createFeedback(feedbackData, function(error, feedback) {
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
                app.all('*', function(req, res){
                    res.status(404);
                    res.render('404', {
                        title: 'airbug 404',
                        production: config.getProperty("production"),
                        staticUrl: config.getProperty("staticUrl")
                    });
                    res.end();
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
                http.createServer(app).listen(app.get('port'), function() {
                    console.log("Express server listening on port " + app.get('port'));
                    flow.complete();
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @return {string}
     */
    generateConfigName: function() {
        var configName = "dev";
        var index = process.argv.indexOf("--config");
        if (index > -1) {
            configName = process.argv[index + 1];
        } else if (process.env.CONFIGBUG) {
            configName = process.env.CONFIGBUG;
        }
        return configName;
    },

    /**
     * @private
     * @param {string} configName
     * @param {function(Throwable, Config=)} callback
     */
    loadConfig: function(configName, callback) {
        this.configbug.getConfig(configName, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.SplashServerApplication', SplashServerApplication);

