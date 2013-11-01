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
var PageManager=    bugpack.require('splash.PageManager');

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

        var betaSignUpButtons = JQuery("#beta-sign-up-button-one, #beta-sign-up-button-two, #beta-sign-up-button-three");
        betaSignUpButtons.on("click", function(event) {
            _this.pageManager.goToPage("betaSignUpPage", "slideleft");
        });

        this.initializeCaptureContent();
        this.initializeImageMarkup();

        var defaultInactiveForm = JQuery("#default-inactive-mode-feature-form");
        defaultInactiveForm.change(function(){
            _this.runChangeToActiveMode();
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

    runChangeToActiveMode:function(){
        var inactiveButton = JQuery("#inactive-button");
        inactiveButton.css("background-color", "green");
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
