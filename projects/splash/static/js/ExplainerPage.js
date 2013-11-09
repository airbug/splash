//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('ExplainerPage')

//@Require('Class')
//@Require('jquery.JQuery')
//@Require('splash.Page')
//@Require('splash.PageManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var JQuery          = bugpack.require('jquery.JQuery');
var Page            = bugpack.require('splash.Page');
var PageManager     = bugpack.require('splash.PageManager');


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

        /**
         * @private
         * @type {number}
         */
        this.timerID = null;
    },


    //-------------------------------------------------------------------------------
    // Page Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initialize: function() {
        this._super();

        this.initializeBetaSignupButtons();
        this.initializeCaptureContent();
        this.initializeImageMarkup();
        this.initializeCodeMarkup();
        this.initializeThreadedMessages();
        this.initializeHeadsDown();

        this.pageManager.addEventListener(PageManager.EventTypes.GOTOPAGE, this.hearGoToPageEvent, this);
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

    /**
     * @private
     * @param {Event} event
     */
    hearGoToPageEvent: function(event){
        console.log("Hearing go to page event");
        var currentPage = event.getData().currentPage.name;
        console.log(currentPage);
        if (currentPage === "betaSignUpPage") {
            JQuery('#beta-sign-up-button-one').hide();
        } else {
            JQuery('#beta-sign-up-button-one').show();
        }
    },


    // Beta Signup Buttons
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeBetaSignupButtons: function() {
        var _this = this;
        var betaSignUpButtons = JQuery("#beta-sign-up-button-one, #beta-sign-up-button-two, #beta-sign-up-button-three");
        betaSignUpButtons.on("click", function(event) {
            _this.pageManager.goToPage("betaSignUpPage", "slideleft");
        });
    },


    // Capture Content
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCaptureContent: function() {
        var _this = this;
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
        var _this = this;
        this.runFakeScreenShot(function() {
            _this.showReplyCaptureContentMessage();
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
    showReplyCaptureContentMessage: function() {
        var replyMessage        = JQuery("#capture-content-reply-message");
        var messagesContainer   = JQuery("#capture-content-messages-container");
        replyMessage.show();
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + replyMessage.position().top
        }, 1000);
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
            _this.showReplyImageMarkupMessage();
        });
    },

    /**
     * @private
     */
    showReplyImageMarkupMessage: function() {
        var replyMessage        = JQuery("#image-markup-reply-message");
        var messagesContainer   = JQuery("#image-markup-messages-container");
        replyMessage.show();
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + replyMessage.position().top
        }, 1000);
    },


    // Code Markup
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCodeMarkup: function() {
        var _this = this;
        var markupButton = JQuery("#code-markup-markup-button");
        markupButton.on("click", function(event) {
            _this.showReplyCodeMarkupMessage();
        });
    },

    /**
     * @private
     */
    showReplyCodeMarkupMessage: function() {
        var replyMessage        = JQuery("#code-markup-reply-message");
        var messagesContainer   = JQuery("#code-markup-messages-container");
        replyMessage.show();
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + replyMessage.position().top
        }, 1000);
    },


    // Threaded Messages
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeThreadedMessages: function() {
        var _this = this;
        var replyButton = JQuery("#threaded-messages-reply-button");
        replyButton.on("click", function(event) {
            _this.showReplyThreadedMessagesMessage();
        });
    },

    /**
     * @private
     */
    showReplyThreadedMessagesMessage: function() {
        var replyMessage        = JQuery("#threaded-messages-reply-message");
        var messagesContainer   = JQuery("#threaded-messages-messages-container");
        replyMessage.show();
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + replyMessage.position().top
        }, 1000);
    },


    // Heads Down
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeHeadsDown: function() {
        var _this = this;
        var headsDownInput = JQuery("#heads-down-input");
        headsDownInput.keyup(function() {
            _this.runChangeToActiveMode();
            _this.startTimerForInactiveMode();
        });
    },

    /**
     * @private
     */
    runChangeToActiveMode: function() {
        var inactiveButton = JQuery("#heads-down-status-indicator");
        inactiveButton.css("background-color", "rgb(204, 230, 204)");
    },

    /**
     * @private
     */
    startTimerForInactiveMode: function() {
        var _this = this;
        if (this.timerID) {
            clearTimeout(this.timerID);
        }
        this.timerID = setTimeout(function() {
            _this.timerID = null;
            _this.runChangeToInactiveMode();
        }, 1000);
    },

    /**
     * @private
     */
    runChangeToInactiveMode: function() {
        var inactiveButton = JQuery("#heads-down-status-indicator");
        inactiveButton.css("background-color", "rgb(226,158,165)");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ExplainerPage', ExplainerPage);
