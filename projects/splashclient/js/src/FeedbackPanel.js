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

//@Export('splash.FeedbackPanel')

//@Require('Class')
//@Require('Obj')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');
    var JQuery  = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    var FeedbackPanel = Class.extend(Obj, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @static
             * @type {boolean}
             */
            this.feedbackPanelOpen = false;

            /**
             * @static
             * @type {boolean}
             */
            this.feedbackSubmitted = false;

            /**
             * @private
             * @type {PageManager}
             */
            this.pageManager = null;

            /**
             * @private
             * @type {SplashApi}
             */
            this.splashApi = null;

            /**
             * @private
             * @type {Tracker}
             */
            this.tracker = null;

            this.body = null;
            this.feedbackTab = null;
            this.feedbackContainer = null;
            this.feedbackEdgeContainer = null;
            this.feedbackForm = null;
            this.feedbackFormCancelButton = null;
            this.feedbackFormSubmitButton = null;
            this.feedbackAirbugPull1 = null;
            this.feedbackAirbugPull2 = null;
            this.feedbackAirbugPull3 = null;
            this.feedbackAirbugThankyou = null;
            this.interferenceContainer = null;
            this.pageContainer = null;


            //-------------------------------------------------------------------------------
            // JQuery Event Handlers
            //-------------------------------------------------------------------------------

            var _this = this;
            this.handleBodyClick = function(event) {
                if (_this.feedbackPanelOpen) {
                    _this.closeFeedbackPanel();
                }
            };

            this.handleFeedbackContainerClick = function(event) {
                event.stopPropagation();
            };

            this.handleFeedbackEdgeContainerClick = function(event) {
                if (_this.feedbackPanelOpen) {
                    _this.closeFeedbackPanel();
                } else {
                    _this.openFeedbackPanel();
                }
            };

            this.handleFeedbackFormCancelButtonClick = function(event) {
                event.preventDefault();
                _this.closeFeedbackPanel();
                return false;
            };

            this.handleFeedbackFormSubmitButtonClick = function(event) {
                event.preventDefault();

                var feedbackFormData = _this.getFeedbackFormData();
                _this.validateFeedbackForm(feedbackFormData, function(error) {
                    if (!error) {
                        _this.submitFeedbackForm(feedbackFormData);
                        _this.closeFeedbackPanel();
                    } else {
                        _this.showFeedbackFormError(error);
                    }
                });
                return false;
            };

            this.handleFeedbackTabClick = function(event) {
                if (_this.feedbackPanelOpen) {
                    _this.closeFeedbackPanel();
                } else {
                    _this.openFeedbackPanel();
                }
                event.stopPropagation();
            };
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        initialize: function() {
            this.feedbackTab = JQuery("#feedback-tab");
            this.body = JQuery('body');
            this.feedbackContainer = JQuery('#feedback-container');
            this.feedbackEdgeContainer = JQuery("#feedback-edge-container");
            this.feedbackForm = JQuery('#feedback-form');
            this.feedbackFormCancelButton = JQuery("#feedback-form-cancel-button");
            this.feedbackFormSubmitButton = JQuery("#feedback-form-submit-button");
            this.feedbackAirbugPull1 = JQuery("#feedback-airbug-pull-1");
            this.feedbackAirbugPull2 = JQuery("#feedback-airbug-pull-2");
            this.feedbackAirbugPull3 = JQuery("#feedback-airbug-pull-3");
            this.feedbackAirbugThankyou = JQuery("#feedback-airbug-thankyou");
            this.interferenceContainer = JQuery("#interference-container");
            this.pageContainer = JQuery("#page-container");

            this.feedbackTab.on("click", this.handleFeedbackTabClick);
            this.body.on("click", this.handleBodyClick);
            this.feedbackContainer.on("click", this.handleFeedbackContainerClick);
            this.feedbackEdgeContainer.on("click", this.handleFeedbackEdgeContainerClick);
            this.feedbackFormCancelButton.on("click", this.handleFeedbackFormCancelButtonClick);
            this.feedbackFormSubmitButton.on("click", this.handleFeedbackFormSubmitButtonClick);

            this.feedbackContainer.show();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        animateFeedbackPanelOpen: function() {

            //TODO BRN: Add some sort of check here for supported css transitions. If they're supported, then use css
            // transitions, otherwise use jquery to animate.

            this.pageContainer.removeClass("page-container-fadein");
            this.pageContainer.addClass("page-container-fadeout");
            this.feedbackContainer.removeClass("feedback-container-collapse");
            this.feedbackContainer.addClass("feedback-container-expand");
            this.feedbackAirbugPull1.removeClass("feedback-airbug-show");
            this.feedbackAirbugPull1.removeClass("feedback-airbug-show-after-collapse");
            this.feedbackAirbugPull1.addClass("feedback-airbug-hide");
            this.feedbackAirbugPull2.removeClass("feedback-airbug-pull-2-collapse");
            this.feedbackAirbugPull2.addClass("feedback-airbug-pull-2-expand");
            this.feedbackAirbugPull3.removeClass("feedback-airbug-hide");
            this.feedbackAirbugPull3.addClass("feedback-airbug-pull-3-expand");
            this.feedbackAirbugPull3.addClass("feedback-airbug-show");
            this.feedbackAirbugThankyou.removeClass("feedback-airbug-show");
            this.feedbackAirbugThankyou.removeClass("feedback-airbug-show-after-collapse");
            this.feedbackAirbugThankyou.addClass("feedback-airbug-hide");
        },

        /**
         * @private
         */
        closeFeedbackPanel: function() {
            if (this.feedbackPanelOpen) {
                this.feedbackPanelOpen = false;
                this.interferenceContainer.css("width", "");
                this.interferenceContainer.css("height", "");
                this.animateFeedbackPanelClose();
            }
        },

        /**
         * @private
         */
        animateFeedbackPanelClose: function() {

            //TODO BRN: Add some sort of check here for supported css transitions. If they're supported, then use css
            // transitions, otherwise use jquery to animate.

            this.pageContainer.removeClass('page-container-fadeout');
            this.pageContainer.addClass('page-container-fadein');
            this.feedbackContainer.removeClass('feedback-container-expand');
            this.feedbackContainer.addClass('feedback-container-collapse');
            if (this.feedbackSubmitted) {
                this.feedbackAirbugPull1.addClass("feedback-airbug-hide");
                this.feedbackAirbugPull1.removeClass("feedback-airbug-show");
                this.feedbackAirbugThankyou.removeClass("feedback-airbug-hide");
                this.feedbackAirbugThankyou.addClass("feedback-airbug-show");
                this.feedbackAirbugThankyou.addClass("feedback-airbug-show-after-collapse");
            } else {
                this.feedbackAirbugPull1.removeClass("feedback-airbug-hide");
                this.feedbackAirbugPull1.addClass("feedback-airbug-show");
                this.feedbackAirbugPull1.addClass("feedback-airbug-show-after-collapse");
            }
            this.feedbackAirbugPull2.removeClass("feedback-airbug-pull-2-expand");
            this.feedbackAirbugPull2.addClass("feedback-airbug-pull-2-collapse");
            this.feedbackAirbugPull3.removeClass("feedback-airbug-pull-3-expand");
            this.feedbackAirbugPull3.removeClass("feedback-airbug-show");
            this.feedbackAirbugPull3.addClass("feedback-airbug-hide");
        },

        /**
         * @private
         * @return {Object}
         */
        getFeedbackFormData: function() {
            var formDataArray = this.feedbackForm.serializeArray();
            var feedbackData = {};
            formDataArray.forEach(function(formEntry) {
                feedbackData[formEntry.name] = formEntry.value;
            });
            feedbackData.currentPage = this.pageManager.getCurrentPage().getName();
            return feedbackData;
        },

        /**
         * @private
         */
        openFeedbackPanel: function() {
            if (!this.feedbackPanelOpen) {
                this.feedbackPanelOpen = true;
                this.interferenceContainer.css("width", "100%");
                this.interferenceContainer.css("height", "100%");
                this.animateFeedbackPanelOpen();
            }
        },

        /**
         * @private
         * @param {Error} error
         */
        showFeedbackFormError: function(error) {
            //TODO BRN: Implement this
        },

        /**
         * @private
         * @param {Object} feedbackFormData
         */
        submitFeedbackForm: function(feedbackFormData) {
            this.tracker.trackGoalComplete("FeedbackSubmitted");
            this.splashApi.send("/splash/api/feedback", feedbackFormData, function(error, result) {
                //TODO BRN: Handle errors
            });
            this.feedbackSubmitted = true;
        },

        validateFeedbackForm: function(feedbackFormData, callback) {
            //TODO BRN: Validate the feedback form data
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.FeedbackPanel', FeedbackPanel);
});
