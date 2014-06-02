//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.SplashConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('jquery.JQuery')
//@Require('sonarbugclient.SonarbugClient')
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
//@Require('splitbug.Splitbug')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var ArgTag           = bugpack.require('bugioc.ArgTag');
var ConfigurationTag = bugpack.require('bugioc.ConfigurationTag');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleTag        = bugpack.require('bugioc.ModuleTag');
var PropertyTag      = bugpack.require('bugioc.PropertyTag');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var SonarbugClient          = bugpack.require('sonarbugclient.SonarbugClient');
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
var SplashApi               = bugpack.require('splash.SplashApi');
var SplashController        = bugpack.require('splash.SplashController');
var ThankYouPage            = bugpack.require('splash.ThankYouPage');
var Tracker                 = bugpack.require('splash.Tracker');
var Splitbug                = bugpack.require('splitbug.Splitbug');
var TermsPage              = bugpack.require('splash.TermsPage');
var PrivacyPage              = bugpack.require('splash.PrivacyPage');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg             = ArgTag.arg;
var bugmeta         = BugMeta.context();
var configuration   = ConfigurationTag.configuration;
var module          = ModuleTag.module;
var property        = PropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SplashConfiguration = Class.extend(Obj, {

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
         * @type {SplashController}
         */
        this._splashController = null;
    },


    //-------------------------------------------------------------------------------
    // IConfiguration Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeConfiguration: function(callback) {
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeConfiguration: function(callback) {
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
     * @return {SonarbugClient}
     */
    sonarbugClient: function() {
        return SonarbugClient.getInstance();
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
     * @return {Splitbug}
     */
    splitbug: function() {
        return Splitbug.getInstance();
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

Class.implement(SplashConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(SplashConfiguration).with(
    configuration("splashConfiguration").modules([
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
                property("pageManager").ref("pageManager"),
                property("splitbug").ref("splitbug")
            ]),
        module("continueSignUpButton"),
        module("dragManager"),
        module("explainerPage")
            .properties([
                property("pageManager").ref("pageManager"),
                property("splitbug").ref("splitbug")
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
        module("sonarbugClient"),
        module("splashApi"),
        module("splashController")
            .properties([
                property("betaSignUpPage").ref("betaSignUpPage"),
                property("explainerPage").ref("explainerPage"),
                property("feedbackPanel").ref("feedbackPanel"),
                property("four04Page").ref("four04Page"),
                property("pageManager").ref("pageManager"),
                property("privacyPage").ref("privacyPage"),
                property("sonarbugClient").ref("sonarbugClient"),
                property("splitbug").ref("splitbug"),
                property("termsPage").ref("termsPage"),
                property("thankYouPage").ref("thankYouPage"),
                property("tracker").ref("tracker")
            ]),
        module("splitbug"),
        module("termsPage"),
        module("thankYouPage"),
        module("tracker")
            .properties([
                property("sonarbugClient").ref("sonarbugClient")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("splash.SplashConfiguration", SplashConfiguration);
