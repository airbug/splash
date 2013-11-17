//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('AirbugJar')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Event =             bugpack.require('Event');
var EventDispatcher =   bugpack.require('EventDispatcher');
var JQuery =            bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugJar = Class.extend(EventDispatcher, {

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
         * @type {Arrow}
         */
        this.arrow = null;

        /**
         * @private
         * @type {Array.<Airbug>}
         */
        this.containedAirbugs = [];

        /**
         * @private
         * @type {ContinueSignUpButton}
         */
        this.continueSignUpButton = null;

        /**
         * @private
         * @type {DragManager}
         */
        this.dragManager = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.element = JQuery("#airbug-jar-container");


        //-------------------------------------------------------------------------------
        // JQuery Event Handlers
        //-------------------------------------------------------------------------------

        var _this = this;

        this.handleDragReleaseOnTarget = function(event) {
            if (_this.isNotFull()) {
                var instructionsContainer = JQuery("#instructions-container");
                instructionsContainer.addClass("hide-instructions");
                event.stopPropagation();
                var draggingObject = _this.dragManager.draggingObject;
                _this.dragManager.releaseDrag();
                _this.addAirbug(draggingObject);
            }
        };
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Array.<string>}
     */
    getAirbugNames: function() {
        var names = [];
        this.containedAirbugs.forEach(function(airbug) {
            names.push(airbug.name);
        });
        return names;
    },

    /**
     * @return {Array.<Airbug>}
     */
    getContainedAirbugs: function() {
        return this.containedAirbugs;
    },

    /**
     * @return {number}
     */
    getCount: function() {
        return this.containedAirbugs.length;
    },

    /**
     * @return {boolean}
     */
    isFull: function() {
        return (this.getCount() >= 3);
    },

    /**
     * @return {boolean}
     */
    isNotFull: function() {
        return !this.isFull();
    },

    /**
     * @return {boolean}
     */
    isEmpty: function(){
        return (this.getCount() === 0);
    },

    /**
     * @param {Airbug} airbug
     * @return {number}
     */
    indexOf: function(airbug) {
        for (var i = 0, size = this.containedAirbugs.length; i < size; i++) {
            var airbugAt = this.containedAirbugs[i];
            if (airbugAt.name === airbug.name) {
                return i;
            }
        }
        return -1;
    },

    /**
     * @param {Airbug} airbug
     */
    addAirbug: function(airbug) {
        if (this.isNotFull()) {
            this.containedAirbugs.push(airbug);
            this.renderAirbugs();
            this.dispatchEvent(new Event(AirbugJar.EventType.AIR_BUG_ADDED, {airbug: airbug}));
        }
    },

    /**
     * @param {Airbug} airbug
     */
    removeAirbug: function(airbug) {
        var index = this.indexOf(airbug);
        if (index > -1) {
            this.containedAirbugs.splice(index, 1);
            this.renderAirbugs();
            this.dispatchEvent(new Event(AirbugJar.EventType.AIR_BUG_REMOVED, {airbug: airbug}));
            if (this.isNotFull()) {
                this.continueSignUpButton.hide();
                this.arrow.show();
            }
        }
    },

    /**
     *
     */
    renderAirbugs: function() {
        this.dragManager.clearProxies();
        for (var i = 0, size = this.containedAirbugs.length; i < size; i++) {
            var airbug = this.containedAirbugs[i];
            var element = airbug.element;
            if (i === 0) {
                this.dragManager.createDragProxy("hotspot1", JQuery("#airbug-jar-hotspot-1"), airbug);
                element.css("left", "245px");
                element.css("top", "340px");
            } else if (i === 1) {
                this.dragManager.createDragProxy("hotspot2", JQuery("#airbug-jar-hotspot-2"), airbug);
                element.css("left", "355px");
                element.css("top", "460px");
            } else {
                this.dragManager.createDragProxy("hotspot3", JQuery("#airbug-jar-hotspot-3"), airbug);
                element.css("left", "235px");
                element.css("top", "540px");
            }
        }
    },

    /**
     *
     */
    startDrag: function() {
        this.element.on("touchend mouseup", this.handleDragReleaseOnTarget);
        this.element.addClass("grabbing");
    },

    /**
     *
     */
    releaseDrag: function() {
        this.element.off("touchend mouseup", this.handleDragReleaseOnTarget);
        this.element.removeClass("grabbing");
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
AirbugJar.EventType = {
    AIR_BUG_ADDED: "AirbugJar:AirbugAdded",
    AIR_BUG_REMOVED: "AirbugJar:AirbugRemoved"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.AirbugJar', AirbugJar);
