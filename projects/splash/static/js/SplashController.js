//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('SplashController')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel       = BugFlow.$parallel;
var $task           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SplashController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BetaSignUpPage}
         */
        this.betaSignUpPage = null;

        /**
         * @private
         * @type {ExplainerPage}
         */
        this.explainerPage = null;

        /**
         * @private
         * @type {FeedbackPanel}
         */
        this.feedbackPanel = null;

        /**
         * @private
         * @type {Four04Page}
         */
        this.four04Page = null;

        /**
         * @private
         * @type {PageManager}
         */
        this.pageManager = null;

        /**
         * @private
         * @type {SonarBugClient}
         */
        this.sonarBugClient = null;

        /**
         * @private
         * @type {ThankYouPage}
         */
        this.thankYouPage = null;

        /**
         * @private
         * @type {Tracker}
         */
        this.tracker = null;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    start: function() {
        var _this = this;
        $parallel([
            $task(function(flow) {
                _this.tracker.configure(_appConfig);
                flow.complete();
            }),
            $task(function(flow){
                _this.sonarBugClient.configure("http://sonarbug.com:80/socket-api", function(error){
                    if (!error) {
                        console.log('SonarBugClient configured');
                    } else {
                        console.error(error);
                    }
                });

                //NOTE BRN: We complete this flow immediately because we don't need to wait for sonarbug to configure before calling the track method
                flow.complete();
            }),
            $task(function(flow){
                _this.splitBug.configure({}, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(){
            if (Loader.appLoaded) {
                _this.initialize();
            } else {
                Loader.addLoadedListener(function() {
                    _this.initialize();
                });
            }
        });
    },

    /**
     *
     */
    initialize: function() {
        this.sonarBugClient.startTracking();
        this.tracker.trackAppLoad();
        this.feedbackPanel.initialize();

        //TODO BRN: This should be done in the SplashConfiguration through ioc instead of here.
        this.pageManager.registerPage(this.betaSignUpPage);
        this.pageManager.registerPage(this.explainerPage);
        this.pageManager.registerPage(this.four04Page);
        this.pageManager.registerPage(this.thankYouPage);
        this.pageManager.goToPage(firstPage);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.SplashController', SplashController);
