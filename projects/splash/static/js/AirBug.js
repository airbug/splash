//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('Airbug')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('splash.IDraggable')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');
var AutowiredAnnotation = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var IDraggable          = bugpack.require('splash.IDraggable');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired           = AutowiredAnnotation.autowired;
var bugmeta             = BugMeta.context();
var property            = PropertyAnnotation.property;


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
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugJar}
         */
        this.airbugJar          = null;

        /**
         * @private
         * @type {DragManager}
         */
        this.dragManager        = null;

        /**
         * @private
         * @type {JQuery}
         */
        this.element            = element;

        /**
         * @private
         * @type {string}
         */
        this.name               = name;

        /**
         * @private
         * @type {boolean}
         */
        this.otherAirbug        = TypeUtil.isBoolean(otherAirbug) ? otherAirbug : false;
    },


    //-------------------------------------------------------------------------------
    // IDraggable Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    deinitializeDraggable: function() {
        this.deactivateDrag();
    },

    /**
     *
     */
    initializeDraggable: function() {
        this.activateDrag();
    },

    /**
     *
     */
    releaseDrag: function() {
        var element = this.element;
        element.css("left", "");
        element.css("top", "");
        element.addClass("drag-released");
        element.addClass("grab");
        element.removeClass("grabbing");
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    setup: function() {
        this.dragManager.registerDraggable(this);
    },

    teardown: function() {
        this.dragManager.deregisterDraggable(this);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    activateDrag: function(){
        var _this = this;
        var element = this.element;
        element.on("touchstart mousedown", function(event) {
            _this.handleInteractionStart(event);
        });
        element.addClass("grab");
    },

    /**
     * @private
     */
    deactivateDrag: function(){
        var element = this.element;
        element.off("touchstart mousedown");
        element.removeClass("grab");
    },

    handleInteractionStart: function(event) {
        event.preventDefault()
        var originalEvent = event.originalEvent;
        var x = undefined;
        var y = undefined;
        if (originalEvent.type === "touchstart") {
            x = originalEvent.touches[0].pageX;
            y = originalEvent.touches[0].pageY;
        } else {
            y = event.clientY;
            x = event.clientX
        }

        console.log("Start drag - x:", x, " y:", y, " event.type:", event.type);
        this.dragManager.startDrag(this, x, y);
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

    /**
     * @return {boolean}
     */
    isOtherAirbug: function() {
        return this.otherAirbug;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Airbug, IDraggable);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Airbug).with(
    autowired().properties([
        property("airbugJar").ref("airbugJar"),
        property("dragManager").ref("dragManager")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.Airbug', Airbug);
