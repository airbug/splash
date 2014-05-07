//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.SplashController')

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

var $parallel   = BugFlow.$parallel;
var $series     = BugFlow.$series;
var $task       = BugFlow.$task;


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
        // Private Properties
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
         * @type {PrivacyPage}
         */
        this.privacyPage = null;

        /**
         * @private
         * @type {SonarbugClient}
         */
        this.sonarbugClient = null;

        /**
         * @private
         * @type {TermsPage}
         */
        this.termsPage = null;

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
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)}
     */
    start: function(callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.configure(function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this.initialize(function(error) {
                    flow.complete(error);
                })
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Error)} callback
     */
    configure: function(callback) {
        var _this = this;
        $parallel([
            $task(function(flow) {

                //TODO BRN: This injection is pretty hacky. Should use a better mechanism for grabbing the configuration

                _this.tracker.configure(_appConfig);
                flow.complete();
            }),
            $task(function(flow){
                _this.sonarbugClient.configure("http://sonarbug.com:80", function(error){
                    if (!error) {
                        console.log('SonarbugClient configured');
                    } else {
                        console.error(error);
                    }
                });

                //NOTE BRN: We complete this flow immediately because we don't need to wait for sonarbug to configure before calling the track method

                flow.complete();
            }),
            $task(function(flow){
                _this.splitbug.configure({}, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {function(Error)}
     */
    initialize: function(callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.sonarbugClient.startTracking();

                //TODO BRN: This should be done in the SplashConfiguration through ioc instead of here.

                _this.pageManager.registerPage(_this.betaSignUpPage);
                _this.pageManager.registerPage(_this.explainerPage);
                _this.pageManager.registerPage(_this.four04Page);
                _this.pageManager.registerPage(_this.privacyPage);
                _this.pageManager.registerPage(_this.termsPage);
                _this.pageManager.registerPage(_this.thankYouPage);

                //TODO BRN: This Loader is hacky. Figure out if there's a way to introduce this as a script tag.

                if (Loader.appLoaded) {
                    flow.complete();
                } else {
                    Loader.addLoadedListener(function() {
                        flow.complete();
                    });
                }
            }),
            $task(function(flow) {
                _this.tracker.trackAppLoad();
                _this.feedbackPanel.initialize();

                //TODO BRN: This firstPage variable is hacky. Figure out a better way to inject and retrieve this..

                _this.pageManager.goToPage(firstPage);
            })
        ]).execute(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.SplashController', SplashController);
