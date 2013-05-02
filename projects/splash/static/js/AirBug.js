//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('Airbug')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var Obj =                   bugpack.require('Obj');
var TypeUtil =              bugpack.require('TypeUtil');
var Annotate =              bugpack.require('annotate.Annotate');
var AutowiredAnnotation =   bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation =    bugpack.require('bugioc.PropertyAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate =  Annotate.annotate;
var autowired = AutowiredAnnotation.autowired;
var property =  PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Airbug = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(name, element, otherAirbug) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugJar}
         */
        this.airbugJar = null;

        /**
         * @private
         * @type {DragManager}
         */
        this.dragManager = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.element = element;

        /**
         * @private
         * @type {string}
         */
        this.name = name;

        /**
         * @private
         * @type {boolean}
         */
        this.otherAirbug = TypeUtil.isBoolean(otherAirbug) ? otherAirbug : false;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    setup: function() {
        this.dragManager.registerDraggableObject(this);
    },

    teardown: function() {
        this.dragManager.deregisterDraggableObject(this);
    },

    initializeDraggableObject: function() {
        this.activateDrag();
    },

    activateDrag: function(){
        var _this = this;
        var element = this.element;
        element.on("touchstart mousedown", function(event) {
            _this.handleInteractionStart(event);
        });
        element.addClass("grab");
    },

    deactivateDrag: function(){
        var element = this.element;
        element.off("touchstart mousedown");
        element.removeClass("grab");
    },

    handleInteractionStart: function(event) {
        event.preventDefault();
        this.dragManager.startDrag(this, event.clientX, event.clientY);
    },

    startDrag: function() {
        this.airbugJar.removeAirbug(this);
        var element = this.element;
        //NOTE BRN: There seems to be a bug here where the cursor is not changed immediately when the mouse is down
        //https://bugs.webkit.org/show_bug.cgi?id=53341

        element.removeClass("grab");
        element.removeClass("drag-released");
        element.addClass("grabbing");
    },

    releaseDrag: function() {
        var element = this.element;
        element.css("left", "");
        element.css("top", "");
        element.addClass("drag-released");
        element.addClass("grab");
        element.removeClass("grabbing");
    },

    /**
     * @return {boolean}
     */
    isOtherAirbug: function() {
        return this.otherAirbug;
    }
});


//-------------------------------------------------------------------------------
// Annotate
//-------------------------------------------------------------------------------

annotate(Airbug).with(
    autowired().properties([
        property("airbugJar").ref("airbugJar"),
        property("dragManager").ref("dragManager")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.Airbug', Airbug);
