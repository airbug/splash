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

        /**
         * @private
         * @type {Object}
         */
        this.buzzTimerIds = {};
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
        this.initializeSnapshotContent();
        this.initializeHeadsDown();
        this.initializeBuzz();
        this.initializeFingertips();

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


    // Snapshots
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeSnapshotContent: function() {
        var _this = this;
        var snapshotButton = JQuery("#snapshot-content-button");
        var run = false;
        snapshotButton.on("click", function() {
            if (!run) {
                run = true;
                _this.showSnapshotContentMessageTwo(function() {
                    setTimeout(function() {
                        _this.showSnapshotContentMessageThree(function() {
                            setTimeout(function() {
                                _this.showSnapshotContentMessageFour();
                            }, 1000);
                        });
                    }, 1000);
                });
            }
        });
    },

    /**
     * @private
     * @param {function()} callback
     */
    showSnapshotContentMessageTwo: function(callback) {

        var messageTwo          = JQuery("#snapshot-content-message-two");
        var messagesContainer   = JQuery("#snapshot-content-messages-container");
        messageTwo.show();
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + messageTwo.position().top
        }, {
            duration: 1000,
            complete: function() {
                callback();
            },
            fail: function() {
                callback();
            }
        });
    },

    /**
     * @private
     * @param {function()} callback
     */
    showSnapshotContentMessageThree: function(callback) {
        var messageThree          = JQuery("#snapshot-content-message-three");
        var messagesContainer   = JQuery("#snapshot-content-messages-container");
        messageThree.show();
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + messageThree.position().top
        }, {
            duration: 1000,
            complete: function() {
                callback();
            },
            fail: function() {
                callback();
            }
        });
    },

    /**
     * @private
     */
    showSnapshotContentMessageFour: function() {
        var messageFour          = JQuery("#snapshot-content-message-four");
        var messagesContainer   = JQuery("#snapshot-content-messages-container");
        messageFour.show();
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + messageFour.position().top
        }, {
            duration: 1000
        });
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
    },


    // Buzz
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeBuzz: function() {
        var _this                   = this;
        var buzzBrianButton         = JQuery("#buzz-brian-button");
        var buzzMichelleButton      = JQuery("#buzz-michelle-button");
        var buzzSungButton          = JQuery("#buzz-sung-button");
        buzzBrianButton.on("click", function(event) {
            _this.runBuzzToActiveMode("brian");
        });
        buzzMichelleButton.on("click", function(event) {
            _this.runBuzzToActiveMode("michelle");
        });
        buzzSungButton.on("click", function(event) {
            _this.runBuzzToActiveMode("sung");
        });
    },

    /**
     * @private
     * @param {string} name
     */
    runBuzzToActiveMode: function(name) {
        var inactiveButton = JQuery("#" + name +"-status-indicator");
        inactiveButton.css("background-color", "rgb(204, 230, 204)");
        this.startTimerForInactiveBuzzMode(name);
    },

    /**
     * @private
     * @param {string} name
     */
    runBuzzToInactiveMode: function(name) {
        var inactiveButton = JQuery("#" + name +"-status-indicator");
        inactiveButton.css("background-color", "rgb(226,158,165)");
    },

    /**
     * @private
     */
    startTimerForInactiveBuzzMode: function(name) {
        var _this = this;
        var timerID = this.buzzTimerIds[name];
        if (timerID) {
            clearTimeout(timerID);
        }
        timerID = setTimeout(function() {
            _this.buzzTimerIds[name] = null;
            _this.runBuzzToInactiveMode(name);
        }, 1000);
        this.buzzTimerIds[name] = timerID;
    },


    // Fingertips
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeFingertips: function() {
        var _this                   = this;
        var imageButton             = JQuery("#fingertips-image-button");
        var codeButton              = JQuery("#fingertips-code-button");
        var githubButton            = JQuery("#fingertips-github-button");
        imageButton.on("click", function(event) {
            _this.addFingertipsImageMessage();
        });
        codeButton.on("click", function(event) {
            _this.addFingertipsCodeMessage();
        });
        githubButton.on("click", function(event) {
            _this.addFingertipsGithubMessage();
        });
    },

    /**
     * @private
     */
    addFingertipsImageMessage: function() {
        var messagesContainer = $("#fingertips-messages-container");
        var imageMessage = $('<div class="message-wrapper">' +
            '<div class="message-sent-by">Dustin' + "</div>" +
            '<div class="message-sent-at">8:40 PM' + "</div>" +
            '<div class="message-image-wrapper">' +
                '<img src="/img/image-message.png" class="message-image" />' +
            "</div>" +
        '</div>');
        messagesContainer.append(imageMessage);
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + imageMessage.position().top
        }, {
            duration: 1000
        });
    },

    /**
     * @private
     */
    addFingertipsGithubMessage: function() {
        var messagesContainer = $("#fingertips-messages-container");
        var githubMessage = $('<div class="message-wrapper">' +
            '<div class="message-sent-by">Sung' + "</div>" +
            '<div class="message-sent-at">8:40 PM' + "</div>" +
            '<div class="message-gist-wrapper">' +
                '<div class="message-gist">THIS IS WHERE GIST SNIPPET BE</div>' +
            '</div>' +
        '</div>');
        messagesContainer.append(githubMessage);
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + githubMessage.position().top
        }, {
            duration: 1000
        });
    },

    /**
     * @private
     */
    addFingertipsCodeMessage: function() {
        var messagesContainer = $("#fingertips-messages-container");
        var codeMessage = $('<div class="message-wrapper">' +
            '<div class="message-sent-by">Sung' + "</div>" +
            '<div class="message-sent-at">8:40 PM' + "</div>" +
            '<div class="message-code-wrapper">' +
                '<div class="message-code">if(false) { <br/>' +
                    '    doSomething(); <br/>' +
                    '} <br/>' +
                '</div>' +
            '</div>' +
        '</div>');
        messagesContainer.append(codeMessage);
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + codeMessage.position().top
        }, {
            duration: 1000
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ExplainerPage', ExplainerPage);
