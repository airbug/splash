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

//@Export('splash.SplashClientConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('jquery.JQuery')
//@Require('splash.AirbugJar')
//@Require('splash.Arrow')
//@Require('splash.BetaSignUpModal')
//@Require('splash.BetaSignUpPage')
//@Require('splash.ContinueSignUpButton')
//@Require('splash.DragManager')
//@Require('splash.ExplainerPage')
//@Require('splash.FeedbackPanel')
//@Require('splash.Four04Page')
//@Require('splash.OtherAirbugForm')
//@Require('splash.PageManager')
//@Require('splash.PrivacyPage')
//@Require('splash.SplashApi')
//@Require('splash.SplashController')
//@Require('splash.TermsPage')
//@Require('splash.ThankYouPage')
//@Require('splash.Tracker')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Obj                     = bugpack.require('Obj');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag        = bugpack.require('bugioc.ConfigurationTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var AirbugJar               = bugpack.require('splash.AirbugJar');
    var Arrow                   = bugpack.require('splash.Arrow');
    var BetaSignUpModal         = bugpack.require('splash.BetaSignUpModal');
    var BetaSignUpPage          = bugpack.require('splash.BetaSignUpPage');
    var ContinueSignUpButton    = bugpack.require('splash.ContinueSignUpButton');
    var DragManager             = bugpack.require('splash.DragManager');
    var ExplainerPage           = bugpack.require('splash.ExplainerPage');
    var FeedbackPanel           = bugpack.require('splash.FeedbackPanel');
    var Four04Page              = bugpack.require('splash.Four04Page');
    var OtherAirbugForm         = bugpack.require('splash.OtherAirbugForm');
    var PageManager             = bugpack.require('splash.PageManager');
    var PrivacyPage             = bugpack.require('splash.PrivacyPage');
    var SplashApi               = bugpack.require('splash.SplashApi');
    var SplashController        = bugpack.require('splash.SplashController');
    var TermsPage               = bugpack.require('splash.TermsPage');
    var ThankYouPage            = bugpack.require('splash.ThankYouPage');
    var Tracker                 = bugpack.require('splash.Tracker');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var configuration           = ConfigurationTag.configuration;
    var module                  = ModuleTag.module;
    var property                = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializingModule}
     */
    var SplashClientConfiguration = Class.extend(Obj, {

        _name: "splash.SplashClientConfiguration",


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
             * @type {SplashController}
             */
            this._splashController = null;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                JQuery(".desktop").removeClass( "desktop" ).addClass( "mobile" );
            }
            this._splashController.start(callback);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugJar}
         */
        airbugJar: function() {
            return new AirbugJar();
        },

        /**
         * @return {Arrow}
         */
        arrow: function() {
            return new Arrow();
        },

        /**
         * @return {BetaSignUpModal}
         */
        betaSignUpModal: function() {
            return new BetaSignUpModal();
        },

        /**
         * @return {BetaSignUpPage}
         */
        betaSignUpPage: function() {
            return new BetaSignUpPage();
        },

        /**
         * @return {ContinueSignUpButton}
         */
        continueSignUpButton: function() {
            return new ContinueSignUpButton();
        },

        /**
         * @return {DragManager}
         */
        dragManager: function() {
            return new DragManager();
        },

        /**
         * @return {ExplainerPage}
         */
        explainerPage: function() {
            return new ExplainerPage();
        },

        /**
         * @return {FeedbackPanel}
         */
        feedbackPanel: function() {
            return new FeedbackPanel();
        },

        /**
         * @return {Four04Page}
         */
        four04Page: function() {
            return new Four04Page();
        },

        /**
         * @return {TermsPage}
         */
        termsPage: function() {
            return new TermsPage();
        },

        /**
         * @return {PrivacyPage}
         */
        privacyPage: function() {
            return new PrivacyPage();
        },

        /**
         * @return {OtherAirbugForm}
         */
        otherAirbugForm: function() {
            return new OtherAirbugForm();
        },

        /**
         * @return {PageManager}
         */
        pageManager: function() {
            return new PageManager();
        },

        /**
         * @return {SplashApi}
         */
        splashApi: function() {
            return new SplashApi();
        },

        /**
         * @return {SplashController}
         */
        splashController: function() {
            this._splashController = new SplashController();
            return this._splashController;
        },

        /**
         * @return {ThankYouPage}
         */
        thankYouPage: function() {
            return new ThankYouPage();
        },

        /**
         * @return {Tracker}
         */
        tracker: function() {
            return new Tracker();
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(SplashClientConfiguration, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(SplashClientConfiguration).with(
        configuration("splashClientConfiguration").modules([
            module("airbugJar")
                .properties([
                    property("arrow").ref("arrow"),
                    property("continueSignUpButton").ref("continueSignUpButton"),
                    property("dragManager").ref("dragManager")
                ]),
            module("arrow"),
            module("betaSignUpModal")
                .properties([
                    property("airbugJar").ref("airbugJar"),
                    property("arrow").ref("arrow"),
                    property("continueSignUpButton").ref("continueSignUpButton"),
                    property("pageManager").ref("pageManager"),
                    property("splashApi").ref("splashApi"),
                    property("tracker").ref("tracker")
                ]),
            module("betaSignUpPage")
                .properties([
                    property("airbugJar").ref("airbugJar"),
                    property("betaSignUpModal").ref("betaSignUpModal"),
                    property("dragManager").ref("dragManager"),
                    property("otherAirbugForm").ref("otherAirbugForm"),
                    property("pageManager").ref("pageManager")
                ]),
            module("continueSignUpButton"),
            module("dragManager"),
            module("explainerPage")
                .properties([
                    property("pageManager").ref("pageManager")
                ]),
            module("feedbackPanel")
                .properties([
                    property("pageManager").ref("pageManager"),
                    property("splashApi").ref("splashApi"),
                    property("tracker").ref("tracker")
                ]),
            module("four04Page"),
            module("otherAirbugForm")
                .properties([
                    property("airbugJar").ref("airbugJar")
                ]),
            module("pageManager")
                .properties([
                    property("tracker").ref("tracker")
                ]),
            module("privacyPage"),
            module("splashApi"),
            module("splashController")
                .properties([
                    property("betaSignUpPage").ref("betaSignUpPage"),
                    property("explainerPage").ref("explainerPage"),
                    property("feedbackPanel").ref("feedbackPanel"),
                    property("four04Page").ref("four04Page"),
                    property("pageManager").ref("pageManager"),
                    property("privacyPage").ref("privacyPage"),
                    property("termsPage").ref("termsPage"),
                    property("thankYouPage").ref("thankYouPage"),
                    property("tracker").ref("tracker")
                ]),
            module("termsPage"),
            module("thankYouPage"),
            module("tracker")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("splash.SplashClientConfiguration", SplashClientConfiguration);
});
