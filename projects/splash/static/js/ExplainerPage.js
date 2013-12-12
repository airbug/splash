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
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PageManager}
         */
        this.pageManager    = null;

        /**
         * @private
         * @type {Splitbug}
         */
        this.splitbug       = null;

        /**
         * @private
         * @type {number}
         */
        this.timerID        = null;

        /**
         * @private
         * @type {Object}
         */
        this.buzzTimerIds   = {};

        /**
         * @private
         * @type {number}
         */
        this.counter        = 0;
    },


    //-------------------------------------------------------------------------------
    // Page Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initialize: function() {
        this._super();

        this.initializeAirbugExample();
        this.initializeBetaSignupButtons();
        this.initializeCaptureContent();
        this.initializeImageMarkup();
        this.initializeCodeMarkup();
        this.initializeThreadedMessages();
        this.initializeSnapshotContent();
        this.initializeHeadsDown();
        this.initializeBuzz();
        this.initializeFingertips();
        this.initializeReply();

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
        var betaSignUpButtons = JQuery("#beta-sign-up-button-one, #beta-sign-up-button-two, #beta-sign-up-button-three, #beta-sign-up-button-text");
        betaSignUpButtons.on("click", function(event) {
            _this.pageManager.goToPage("betaSignUpPage", "slideleft");
        });
    },


    // airbug example
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeAirbugExample: function() {
        var _this               = this;
        var chatForm            = JQuery("#airbug-chat-form");
        var chatSendButton      = JQuery("#airbug-chat-send-button");
        var toolbarImageButton  = JQuery("#airbug-toolbar-image-button");
        var toolbarCodeButton   = JQuery("#airbug-toolbar-code-button");
        var toolbarGithubButton = JQuery("#airbug-toolbar-github-button");

        chatForm.on('keypress', function(event){
            _this.handleAirbugChatFormKeyPress(event);
        });
        chatSendButton.on("click", function(event) {
            _this.handleAirbugChatSendButtonClick(event);
        });
        toolbarImageButton.on("click", function(event) {
            _this.addAirbugImageMessage();
        });
        toolbarCodeButton.on("click", function(event) {
            _this.addAirbugCodeMessage();
        });
        toolbarGithubButton.on("click", function(event) {
            _this.addAirbugGithubMessage();
        });
    },


//First Message
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeReply: function() {
        var _this	            = this;

        setTimeout(function() {
            _this.addAirbugReplyMessage();

        }, 1500);

    },

    /**
     * @private
     */
    addAirbugReplyMessage: function() {
        var _this	            = this;
        var initialMessageContainer = $("#airbug-messages-container");
        var replyMessageContainer = $('<div id="airbug-reply-message" class="message-wrapper">' +
                '<div class="message-sent-by">Dustin</div>' +
                '<div class="message-sent-at">8:40PM</div>' +
                '<div class="message-body">Check us out and click around on the site. Want to see the real thing in action? <a id="beta-sign-up-button-text" > Request a beta invite</a> or get one from your friends!</div>'  +
                '<span class="message-body">Click on the pencil to try out our nifty image markup feature!</span><br/><br/>' +
                '<div class="message-image-wrapper">' +
                    '<img src="/img/image-message.png" class="message-image"/>' +
                    '<div class="message-image-markup-icon">' +
                        '<button id="airbug-image-markup-button" type="button" class="airbug-button-invert">' +
                            '<div class="glyphicon glyphicon-pencil"></div>' +
                    '</button>' +
                    '</div>' +
                '</div>' +
            '</div>');
        replyMessageContainer.hide().fadeIn(400);
        initialMessageContainer.append(replyMessageContainer);
        initialMessageContainer.animate ({
            scrollTop: initialMessageContainer.scrollTop() + replyMessageContainer.position().top
        }, {
            duration: 1000
        });
        var imageMarkupButton = replyMessageContainer.find("#airbug-image-markup-button");

        imageMarkupButton.on("click", function(event) {
            _this.addAirbugImageMarkupMessage();
        });

        var betaSignUpButtons = JQuery("#beta-sign-up-button-one, #beta-sign-up-button-two, #beta-sign-up-button-three, #beta-sign-up-button-text");
        betaSignUpButtons.on("click", function(event) {
            _this.pageManager.goToPage("betaSignUpPage", "slideleft");
        });
    },

    /**
     * @private
     */
    addAirbugTextMessage: function(text) {
        var messagesContainer = $("#airbug-messages-container");
        var imageMessage = $('<div class="message-wrapper">' +
                '<div class="message-sent-by">You</div>' +
                '<div class="message-sent-at">8:40 PM</div>' +
                '<div class="message-body">' +
                '<span>' + text + '</span>' +
                '</div>' +
            '</div>');
        imageMessage.hide().fadeIn(400);
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
    addAirbugImageMarkupMessage: function() {
        var messagesContainer = $("#airbug-messages-container");
        var imageMessage = $('<div class="message-wrapper">' +
                '<div class="message-sent-by">You</div>' +
                '<div class="message-sent-at">8:40 PM</div>' +
                '<div class="message-image-wrapper">' +
                    '<img src="/img/image-message.png" class="message-image"/>' +
                    '<img src="/img/airbug-circle.png" class="circle-image"/>' +
                '</div>' +
            '</div>');
        imageMessage.hide().fadeIn(400);
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
    addAirbugImageMessage: function() {
        var _this = this;
        this.counter++;
        var newId = "airbug-image-markup-button-" + this.counter;
        var messagesContainer = $("#airbug-messages-container");
        var imageMessage = $('<div class="message-wrapper">' +
            '<div class="message-sent-by">You</div>' +
            '<div class="message-sent-at">8:40 PM</div>' +
            '<div class="message-image-wrapper">' +
                '<img src="/img/image-message.png" class="message-image"/>' +
                '<div class="message-image-markup-icon">' +
                    '<button id="' + newId + '" type="button" class="airbug-button-invert">' +
            '           <div class="glyphicon glyphicon-pencil"></div>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>');
        imageMessage.hide().fadeIn(400);
        messagesContainer.append(imageMessage);
        $("#" + newId).on("click", function(event) {
            _this.addAirbugImageMarkupMessage();
        });
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + imageMessage.position().top
        }, {
            duration: 1000
        });
    },

    /**
     * @private
     */
    addAirbugGithubMessage: function() {
        var messagesContainer = $("#airbug-messages-container");
        var githubMessage = $('<div class="message-wrapper">' +
            '<div class="message-sent-by">You</div>' +
            '<div class="message-sent-at">8:40 PM</div>' +
            '<div class="message-gist-wrapper">' +
                '<div class="number-wrap">' +
                    '<span class="number-list">1</span>' +
                    '<span class="number-list">2</span>' +
                    '<span class="number-list">3</span>' +
                    '<span class="number-list">4</span>' +
                '</div>' +
                '<div class="message-gist-list"> ' +
                    '<span>Array(16).join(&quot;wat&quot; - 1)&nbsp;+</span></br>' +
                    '<span>&nbsp;&nbsp;&quot;Batman!&quot;</span></br>' +
                    '<span></br></span>' +
                    '<span></span></br>' +
                '</div>' +
                '<div class="gist-list-bottom">gist by GitHub</div>' +
            '</div>' +
        '</div>');
        githubMessage.hide().fadeIn(400);
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
    addAirbugCodeMessage: function() {
        var messagesContainer = $("#airbug-messages-container");
        var codeMessage = $('<div class="message-wrapper">' +
            '<div class="message-sent-by">You</div>' +
            '<div class="message-sent-at">8:40 PM</div>' +
            '<div class="message-code-finger-wrapper">' +
                '<div class="message-code">' +
                    '<span>0x3A28213A</span><br/>' +
                    '<span>0x6339392C</span><br/>' +
                    '<span>0x7363682E</span><br/>' +
                '</div>' +
            '</div>' +
        '</div>');
        codeMessage.hide().fadeIn(400);
        messagesContainer.append(codeMessage);
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + codeMessage.position().top
        }, {
            duration: 1000
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
            _this.handleContentCaptureButtonClick();
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
    addCaptureContentText: function(text) {
        var messagesContainer = $("#capture-content-messages-container");
        var textMessage = $('<div id="capture-content-reply-message" class="message-wrapper">' +
            '<div class="message-sent-by">You</div>' +
            '<div class="message-sent-at">8:40 PM</div>' +
            '<div class="message-body">' +
            '<span>' + text + '</span>' +
            '<div class="message-image-wrapper">' +
                '<img src="/img/image-message-upsidedown.png" class="message-image">' +
            '</div>' +
        '</div>' +
    '</div>');
        textMessage.hide().fadeIn(400);
        messagesContainer.append(textMessage);
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + textMessage.position().top
        }, {
            duration: 1000
        }); console.log();
    },


//    /**
//     * @private
//     */
//    showReplyCaptureContentMessage: function() {
//        var replyMessage        = JQuery("#capture-content-reply-message");
//        var messagesContainer   = JQuery("#capture-content-messages-container");
//        replyMessage.show();
//        messagesContainer.animate({
//            scrollTop: messagesContainer.scrollTop() + replyMessage.position().top
//        }, 1000);
//    },

    /**
     * @protected
     * @param {string} jqueryId
     * @return {Object}
     */
    getInputData: function(jqueryId) {
        return JQuery(jqueryId).val();
    },

    /**
     * @protected
     */
    submitContentCapture: function() {
        var inputData = this.getInputData("#capture-content-chat-input");
        JQuery("#capture-content-chat-input").val("");
        this.addCaptureContentText(inputData);
    },

    handleContentCaptureButtonClick: function(event) {
        this.submitContentCapture();
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
                                _this.closeBugReport();
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

    /**
     * @private
     */
    closeBugReport: function(){
        var bugReportClosed = JQuery("#report-closed");
        var bugReportOpenChange = JQuery("#report-open");
        bugReportClosed.show();
        bugReportOpenChange.hide();
    },


    // Heads Down
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeHeadsDown: function() {
        var _this = this;
        var headsDownInput = JQuery("#heads-down-input");
        var headsDownButton = JQuery("#heads-down-arrow-button");
        headsDownInput.keyup(function() {
            _this.runChangeToActiveMode();
            _this.startTimerForInactiveMode();
        });
        headsDownButton.on("click", function(event) {
            _this.runChangeToActiveMode();
            _this.startTimerForInactiveMode();
            _this.handleHeadsDownSendButtonClick();
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

    /**
     * @private
     */

    addHeadDownText: function(text) {
        var messagesContainer = $("#heads-down-content-container");
        var textMessage = $('<div class="message-wrapper">' +
            '<div class="message-sent-by">You</div>' +
            '<div class="message-sent-at">8:40 PM</div>' +
            '<div class="message-body">' +
            '<span>' + text + '</span>' +
            '</div>' +
        '</div>');
        textMessage.hide().fadeIn(400);
        messagesContainer.append(textMessage);
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + textMessage.position().top
        }, {
            duration: 1000
        }); console.log();
    },

    /**
     * @protected
     * @param {string} jqueryId
     * @return {Object}
     */
    getInputData: function(jqueryId) {
        return JQuery(jqueryId).val();
    },

    /**
     * @protected
     */
    submitHeadsDownChat: function() {
        var inputData = this.getInputData("#heads-down-input");
        JQuery("#heads-down-input").val("");
        this.addHeadDownText(inputData);
    },

    handleHeadsDownSendButtonClick: function(event) {
        this.submitHeadsDownChat();
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

        //airbug example
        var buzzBrian2Button        = JQuery("#buzz-brian2-button");
        var buzzDustin2Button       = JQuery("#buzz-dustin2-button");
        var buzzMichelle2Button     = JQuery("#buzz-michelle2-button");
        var buzzSung2Button         = JQuery("#buzz-sung2-button");
        var buzzTim2Button          = JQuery("#buzz-tim2-button");

        buzzBrian2Button.on("click", function(event) {
            _this.runBuzzToActiveMode("brian2");
        });
        buzzDustin2Button.on("click", function(event) {
            _this.runBuzzToActiveMode("dustin2");
        });
        buzzMichelle2Button.on("click", function(event) {
            _this.runBuzzToActiveMode("michelle2");
        });
        buzzSung2Button.on("click", function(event) {
            _this.runBuzzToActiveMode("sung2");
        });
        buzzTim2Button.on("click", function(event) {
            _this.runBuzzToActiveMode("tim2");
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
            '<div class="message-sent-by">You</div>' +
            '<div class="message-sent-at">8:40 PM</div>' +
            '<div class="message-image-wrapper">' +
                '<img src="/img/image-message.png" class="fingertips-image-wrapper"/>' +
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
            '<div class="message-sent-by">You </div>' +
            '<div class="message-sent-at">8:40 PM </div>' +
            '<div class="message-gist-wrapper">' +
                '<div class="number-wrap">' +
                    '<span class="number-list">1</span>' +
                    '<span class="number-list">2</span>' +
                    '<span class="number-list">3</span>' +
                    '<span class="number-list">4</span>' +
                '</div>' +
                '<div class="message-gist-list"> ' +
                    '<span>while (!tooMuchAdvice) {</span></br>' +
                    '<span>&nbsp;&nbsp;pointers++;</span></br>' +
                    '<span>}</span></br>' +
                    '<span></span></br>' +
                '</div>' +
                '<div class="gist-list-bottom">gistfile1.txt by GitHub</div>' +
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
            '<div class="message-sent-by">You</div>' +
            '<div class="message-sent-at">8:40 PM</div>' +
            '<div class="message-code-finger-wrapper">' +
                '<div class="message-code"> 0x3A28213A</br>' +
                    '0x6339392C<br/>' +
                    '0x7363682E' +
                '</div>' +
            '</div>' +
        '</div>');
        messagesContainer.append(codeMessage);
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollTop() + codeMessage.position().top
        }, {
            duration: 1000
        });
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} jqueryId
     * @return {Object}
     */
    getInputData: function(jqueryId) {
        return JQuery(jqueryId).val();
    },

    /**
     * @protected
     */
    submitFormChatForm: function() {
        var inputData = this.getInputData("#airbug-chat-input");
        JQuery("#airbug-chat-input").val("");
        this.addAirbugTextMessage(inputData);
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {jQuery.Event} event
     */
    handleAirbugChatFormEnterKeyPress: function(event) {
        this.submitFormChatForm();
        event.preventDefault();
        event.stopPropagation();
        return false;
    },

    /**
     * @param {jQuery.Event} event
     */
    handleAirbugChatFormKeyPress: function(event) {
        var key = event.which;
        var ctl = event.ctrlKey;
        if(key === 13 && !ctl){
            this.handleAirbugChatFormEnterKeyPress(event);
        }
    },

    /**
     * @private
     * @param {jQuery.Event} event
     */
    handleAirbugChatSendButtonClick: function(event) {
        this.submitFormChatForm();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ExplainerPage', ExplainerPage);
