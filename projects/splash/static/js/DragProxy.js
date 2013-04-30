//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('DragProxy')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj =   bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DragProxy = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(name, element, draggableObject, dragManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.draggableObject = draggableObject;

        /**
         * @private
         * @type {DragManager}
         */
        this.dragManager = dragManager;

        /**
         * @private
         * @type {Element}
         */
        this.element = element;

        /**
         * @private
         * @type {string}
         */
        this.name = name;

        var _this = this;
        this._handle = function(event) {
            _this.handleInteractionStart(event);
        };
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    setup: function() {
        this.dragManager.registerDraggableObject(this);
    },
    initializeDragProxy: function() {
        this.element.on("touchstart mousedown", this._handle);
        this.element.addClass("grab");
    },
    uninitializeDragProxy: function() {
        this.element.off("touchstart mousedown", this._handle);
        this.element.removeClass("grab");
        this.element.removeClass("grabbing");
    },
    startDrag: function() {
        this.element.addClass("grabbing");
        this.element.removeClass("grab");
    },
    releaseDrag: function() {
        this.element.addClass("grab");
        this.element.removeClass("grabbing");
    },
    handleInteractionStart: function(event) {
        event.preventDefault();
        this.dragManager.startDrag(this.draggableObject, event.clientX, event.clientY);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.DragProxy', DragProxy);
