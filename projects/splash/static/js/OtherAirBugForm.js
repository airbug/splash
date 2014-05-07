//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.OtherAirbugForm')

//@Require('Class')
//@Require('Obj')
//@Require('jquery.JQuery')
//@Require('splash.Airbug')
//@Require('splash.AirbugJar')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var JQuery =    bugpack.require('jquery.JQuery');
var Airbug =    bugpack.require('splash.Airbug');
var AirbugJar = bugpack.require('splash.AirbugJar');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var OtherAirbugForm = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(name, element) {

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
         * @type {number}
         */
        this.count = 0;

        /**
         * @private
         * @type {JQuery}
         */
        this.element = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.elementInstructionsContainer = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.elementOtherAirbugFauxFormInput = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.elementOtherAirbugFormCancelButton = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.elementOtherAirbugFormContainerInput = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.elementOtherAirbugFormContainerBtn = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.elementOtherAirbugFormSubmitButton = null;

        /**
         * @private
         * @type {Airbug}
         */
        //TODO BRN: How is this used?
        this.otherAirbug = new Airbug("other", JQuery("#airbug-other-container"));


        //-------------------------------------------------------------------------------
        // JQuery Event Handlers
        //-------------------------------------------------------------------------------

        var _this = this;
        this.handleInputFieldClick = function() {
            _this.removeWarning();
            _this.showButtons();
        };
        this.handleSubmitButtonClick = function(event) {
            if (_this.airbugJar.isNotFull()) {
                var otherAirbug = _this.createOtherAirbug();
                _this.airbugJar.addAirbug(otherAirbug);
                _this.elementOtherAirbugFormContainerInput.val('');
            } else {
                _this.addWarning();
            }
            _this.hideButtons();
        };
        this.handleCancelButtonClick = function(event) {
            _this.elementOtherAirbugFormContainerInput.val('');
            _this.elementOtherAirbugFormContainerBtn.hide();
            _this.elementOtherAirbugFormCancelButton.hide();
        };
        this.handleInputFieldKeyup = function(event) {
            if (event.keyCode == 13) {
                _this.handleSubmitButtonClick(event);
                if (_this.airbugJar.isNotFull()) {
                    _this.showButtons();
                }
            } else {
                var inputValue = _this.elementOtherAirbugFormContainerInput.val();
                _this.elementOtherAirbugFauxFormInput.attr('placeholder', inputValue);
            }
        };
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initialize: function() {
        this.element = JQuery('#other-airbug-form-container');
        this.elementOtherAirbugFauxFormInput = JQuery('#other-airbug-faux-form input');
        this.elementOtherAirbugFormCancelButton = JQuery("#other-airbug-form-cancel-button");
        this.elementOtherAirbugFormContainerInput = JQuery('#other-airbug-form-container input');
        this.elementOtherAirbugFormContainerBtn = JQuery('#other-airbug-form-container .btn');
        this.elementOtherAirbugFormSubmitButton = JQuery("#other-airbug-form-submit-button");

        this.elementOtherAirbugFormSubmitButton.on('click', this.handleSubmitButtonClick);
        this.elementOtherAirbugFormCancelButton.on('click', this.handleCancelButtonClick);
        this.elementOtherAirbugFormContainerInput.on('click', this.handleInputFieldClick);
        this.elementOtherAirbugFormContainerInput.keyup(this.handleInputFieldKeyup);
        this.airbugJar.addEventListener(AirbugJar.EventType.AIR_BUG_REMOVED, this.hearAirbugRemovedEvent, this);
    },
    hide: function() {
        this.element.hide()
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    removeWarning: function(){
        this.elementOtherAirbugFormContainerInput.removeClass('warning');
        this.elementOtherAirbugFormContainerInput.val('');
    },

    /**
     * @private
     */
    addWarning: function(){
        this.elementOtherAirbugFormContainerInput.val('Too many bugs in the jar!');
        this.elementOtherAirbugFormContainerInput.addClass('warning');
    },

    /**
     * @private
     */
    hideButtons: function(){
        this.elementOtherAirbugFormContainerBtn.hide();
        this.elementOtherAirbugFormCancelButton.hide();
    },

    /**
     * @private
     */
    showButtons: function(){
        this.elementOtherAirbugFormContainerBtn.show();
        this.elementOtherAirbugFormCancelButton.show();
    },

    /**
     * @return {Airbug}
     */
    createOtherAirbug: function(){
        this.count++;
        var inputValue              = JQuery('#other-airbug-form-container input').val();
        var otherAirbugHtml         =
            '<div id="airbug-other-' + this.count + '-container", class="airbug-container airbug-other-container">' +
                '<img id="airbug-other-image", class="airbug-image", src= "' + _appConfig.staticUrl + '/img/airbug-service-swarm-other.png", alt="Other"/>' +
                '<div class="other-airbug-faux-form">' +
                    '<div class="control-group">' +
                        '<div class="controls">' +
                            '<input type="text" id="other" name="other" placeholder="Other Tools" />' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        JQuery('#bug-swarm-container').append(otherAirbugHtml);
        var otherAirbug             = new Airbug('other: ' + inputValue, JQuery("#airbug-other-" + this.count + "-container"), true);
        JQuery("#airbug-other-" + this.count + "-container .other-airbug-faux-form input").val(inputValue);
        return otherAirbug;
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    hearAirbugRemovedEvent: function(event) {
        var airbug = event.getData().airbug;
        if (airbug.isOtherAirbug()) {
            airbug.element.fadeOut(1200);
            this.removeWarning();
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.OtherAirbugForm', OtherAirbugForm);
