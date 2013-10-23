//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('ExplainerPage')

//@Require('Class')
//@Require('jquery.JQuery')
//@Require('splash.Page')
//@Require('splash.PageManager')
//@Require('splitbug.Splitbug')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var JQuery =        bugpack.require('jquery.JQuery');
var Page =          bugpack.require('splash.Page');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ExplainerPage = Class.extend(Page, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("explainerPage", JQuery("#explainer-page"));


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PageManager}
         */
        this.pageManager = null;

        /**
         * @private
         * @type {Splitbug}
         */
        this.splitbug = null;
    },


    //-------------------------------------------------------------------------------
    // Page Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initialize: function() {
        this._super();

        var _this = this;
        var marketingTaglineHeader = JQuery("#marketing-tagline-header");
        this.splitbug.splitTest({
            name: "alternate-tag-line",
            controlFunction: function() {
                marketingTaglineHeader.html("Unite and motivate your team's cross-platform collaboration");
            },
            testFunction: function() {
                marketingTaglineHeader.html("Collaborative chat for developers");
            }
        });

        var betaSignUpButton = JQuery("#beta-sign-up-button");
        betaSignUpButton.on("click", function(event) {
            _this.pageManager.goToPage("betaSignUpPage", "slideleft");
        });
        this.initializeCaptureContent();
        this.initializeImageMarkup();
    },

    /**
     *
     */
    activate: function(pageTransition) {
        this._super(pageTransition);
        var loadingPage = JQuery("#loading-page");
        loadingPage.hide();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    // Capture Content
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCaptureContent: function() {
        var _this = this;
        var captureContentChatForm = JQuery("#capture-content-chat-form");
        captureContentChatForm.mouseover(function(event) {
            _this.showFirstMessage();
        });
        var captureContentCameraButton = JQuery("#capture-content-camera-button");
        captureContentCameraButton.on("click", function(event) {
            _this.runCaptureContent(function() {

            });
        });
    },

    /**
     * @private
     * @param {function()} callback
     */
    runCaptureContent: function(callback) {
        var replyMessage        = JQuery("#capture-content-reply-message");
        var messagesContainer   = JQuery("#capture-content-messages-container");
        this.runFakeScreenShot(function() {
            replyMessage.show();
            messagesContainer.animate({
                scrollTop: messagesContainer.scrollTop() + replyMessage.position().top
            }, 1000);
        });
    },

    /**
     * @private
     */
    runFakeScreenShot: function(callback) {
        var fakeScreenShotContainer = JQuery("#fake-screen-shot-container");
        fakeScreenShotContainer.show();
        setTimeout(function() {
            fakeScreenShotContainer.css("opacity", 0);
            setTimeout(function() {
                fakeScreenShotContainer.css("opacity", 1);
                fakeScreenShotContainer.hide();
                callback();
            }, 600);
        }, 0);
    },

    /**
     * @private
     */
    showFirstMessage: function() {
        var startMessage        = JQuery("#capture-content-start-message");
        startMessage.show();
    },


    // Image Markup
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeImageMarkup: function() {
        var _this = this;
        var markupButton = JQuery("#image-markup-markup-button");
        markupButton.on("click", function(event) {
            _this.showImageMarkupPopup();
        });
    },

    /**
     * @private
     */
    embedImageMarkupInMessage: function() {
        /*var image = new Image();
        img.id = "pic"
        img.src = canvas.toDataURL();*/
    },

    /**
     * @private
     */
    showImageMarkupPopup: function() {
        //TODO BRN: Show the image markup popup
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ExplainerPage', ExplainerPage);
