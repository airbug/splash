/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.SplashController')

//@Require('Class')
//@Require('Flows')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Flows       = bugpack.require('Flows');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $parallel   = Flows.$parallel;
    var $series     = Flows.$series;
    var $task       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var SplashController = Class.extend(Obj, {

        _name: "splash.SplashController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
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
        // Public Methods
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
        // Private Methods
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
                })
            ]).execute(callback);
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        initialize: function(callback) {
            var _this = this;
            $series([
                $task(function(flow) {

                    //TODO BRN: This should be done by PageManager registering itself as an IOC processor instead of here.

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
                    flow.complete();
                })
            ]).execute(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.SplashController', SplashController);
});
