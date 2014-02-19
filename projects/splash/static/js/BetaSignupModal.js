//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('BetaSignUpModal')

//@Require('Class')
//@Require('Obj')
//@Require('jquery.JQuery')
//@Require('splash.AirbugJar')
//@Require('splash.Arrow')
//@Require('splash.ContinueSignUpButton')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var Obj =                   bugpack.require('Obj');
var JQuery =                bugpack.require('jquery.JQuery');
var AirbugJar =             bugpack.require('splash.AirbugJar');
var Arrow =                 bugpack.require('splash.Arrow');
var ContinueSignUpButton =  bugpack.require('splash.ContinueSignUpButton');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BetaSignUpModal = Class.extend(Obj, {

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
         * @type {AirbugJar}
         */
        this.airbugJar = null;

        /**
         * @private
         * @type {Arrow}
         */
        this.arrow = null;

        /**
         * @private
         * @type {ContinueSignUpButton}
         */
        this.continueSignUpButton = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.element = JQuery("#beta-sign-up-modal");

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

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


        //-------------------------------------------------------------------------------
        // JQuery Event Handlers
        //-------------------------------------------------------------------------------

        var _this = this;

        this.handleCancelButtonClick = function(event) {
            event.preventDefault();
            _this.hide();
            JQuery('#name+.validation').removeClass("invalid");
            JQuery('#email+.validation').removeClass("invalid");
            return false;
        };

        this.handleSubmitButtonClick = function(event) {
            event.preventDefault();
            var formData = _this.getFormData();
            JQuery('#name+.validation').removeClass("invalid");
            JQuery('#email+.validation').removeClass("invalid");
            _this.validateForm(formData, function(error) {
                if (!error) {
                    _this.submitForm(formData);
                    _this.hide();
                    _this.pageManager.goToPage("thankYouPage", "slideup");
                } else {
                    _this.showFormError(error);
                }
            });
            return false;
        };
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initialize: function() {
        var _this = this;
        if (!this.initialized) {
            this.initialized = true;
            var betaSignUpSubmitButton = JQuery("#beta-sign-up-form-submit-button");
            var betaSignUpCancelButton = JQuery("#beta-sign-up-form-cancel-button");
            var betaSignUpCloseButton  = JQuery(".modal-header .close");
            betaSignUpSubmitButton.on("click", this.handleSubmitButtonClick);
            betaSignUpCancelButton.on("click", this.handleCancelButtonClick);
            betaSignUpCloseButton.on("click", this.handleCancelButtonClick);
            this.continueSignUpButton.element.on("click", function(){
                _this.element.modal('show');
            });
            this.airbugJar.addEventListener(AirbugJar.EventType.AIR_BUG_ADDED, this.handleAirbugAddedEvent, this);
        }
    },

    /**
     *
     */
    show: function() {
        this.element.modal('show');
        this.arrow.hide();
        this.continueSignUpButton.show();
    },

    /**
     *
     */
    hide: function() {
        this.element.modal('hide');
    },

    /**
     * @return {Object}
     */
    getFormData: function() {
        var formDataArray = JQuery('#beta-sign-up-form').serializeArray();
        var betaSignUpData = {};
        formDataArray.forEach(function(formEntry) {
            betaSignUpData[formEntry.name] = formEntry.value;
        });
        betaSignUpData.wishList = this.airbugJar.getAirbugNames();
        return betaSignUpData;
    },

    /**
     * @private
     * @param {Object} formData
     */
    submitForm: function(formData) {
        this.tracker.trackGoalComplete("SignedUpForBeta");
        this.splashApi.send("/splash/api/beta-sign-up", formData, function(error, result) {
            //TODO BRN: Handle errors
        });
    },

    validateForm: function(formData, callback) {
        var formDataArray = JQuery('#beta-sign-up-form').serializeArray();
        var error = null;
        formDataArray.forEach(function(formEntry){
            var name = formEntry.name;
            var value = formEntry.value;
            if((name === 'name' && value === '') || (name === 'email' && value === '') || (name === 'company' && value === '') || (name === 'companySize' && value === '')  || (name === 'position' && value === '')){
                JQuery('#' + name + '+.validation').addClass("invalid");
                error = new Error("Required fields have not been filled in");
            }
        });
        callback(error);
    },

    showFormError: function(error) {
        //TODO BRN
    },

    /**
     * @private
     * @param {Event} event
     */
    handleAirbugAddedEvent: function(event) {
        var _this = this;
        if (this.airbugJar.isFull()) {
            //TODO BRN (QUESTION): Why the setTimeout?
            setTimeout(function() {
                _this.show();
                //TODO: Make airbugs ungrabbable
            }, 1200);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.BetaSignUpModal', BetaSignUpModal);
