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
         * @type {ImageMarkupEditor}
         */
        this.imageMarkupEditor  = null;

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

        var betaSignUpButtons = JQuery("#beta-sign-up-button-one, #beta-sign-up-button-two, #beta-sign-up-button-three");
        betaSignUpButtons.on("click", function(event) {
            _this.pageManager.goToPage("betaSignUpPage", "slideleft");
        });

        this.initializeCaptureContent();
        this.initializeImageMarkup();

        var defaultInactiveForm = JQuery("#default-inactive-mode-feature-form");
        defaultInactiveForm.keyup(function(){
            _this.runChangeToActiveMode();
            _this.startTimerForInactiveMode();
        });


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


    // Capture Content
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCaptureContent: function() {
        var _this = this;
        var captureContentChatForm = JQuery("#capture-content-chat-form");
        captureContentChatForm.mouseover(function(event) {
            _this.showFirstCaptureContentMessage();
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
        var _this = this;
        this.runFakeScreenShot(function() {
            _this.showReplyCaptureContentMessage();
        });
    },

    /**
     * @private
     */
    runChangeToActiveMode: function() {
        var inactiveButton = JQuery("#inactive-button");
        inactiveButton.css("background-color", "green");
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
        var inactiveButton = JQuery("#inactive-button");
        inactiveButton.css("background-color", "red");  
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
    showFirstCaptureContentMessage: function() {
        var startMessage        = JQuery("#capture-content-start-message");
        startMessage.show();
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
    activateImageMarkupEditor: function() {
        this.imageMarkupEditor.loadImage("http://placekitten.com/600/400");
        this.imageMarkupEditor.activate();
    },

    /**
     * @private
     */
    initializeImageMarkup: function() {
        var _this = this;
        var markupButton = JQuery("#image-markup-markup-button");
        markupButton.on("click", function(event) {
            //TODO BRN
        });
        this.imageMarkupEditor.initialize();
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ExplainerPage', ExplainerPage);
