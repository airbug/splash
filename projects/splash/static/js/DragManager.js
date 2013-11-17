//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('DragManager')

//@Require('Class')
//@Require('Obj')
//@Require('List')
//@Require('jquery.JQuery')
//@Require('splash.DragProxy')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var List        = bugpack.require('List');
var Obj         = bugpack.require('Obj');
var JQuery      = bugpack.require('jquery.JQuery');
var DragProxy   = bugpack.require('splash.DragProxy');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DragManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        this.draggingObject = null;
        this.boundingOffsets = null;
        this.dragStartOffsets = null;
        this.draggableObjects = new List();
        this.dragTargets = [];
        this.dragProxies = [];


        //-------------------------------------------------------------------------------
        // JQuery Event Listeners
        //-------------------------------------------------------------------------------

        var _this = this;

        this.handleDragMove = function(event) {
            _this.moveDrag(event.clientX, event.clientY);
        };

        this.handleDragRelease = function(event) {
            _this.releaseDrag();
        };
    },

    //-------------------------------------------------------------------------------
    // Static Class Methods
    //-------------------------------------------------------------------------------

    createDragProxy: function(name, element, draggableObject) {
        var dragProxy = new DragProxy(name, element, draggableObject, this);
        this.registerDragProxy(dragProxy);
    },
    registerDraggableObject: function(draggableObject) {
        this.draggableObjects.add(draggableObject);
        draggableObject.initializeDraggableObject();
    },
    deregisterDraggableObject: function(draggableObject) {
        this.draggableObjects.remove(draggableObject);
        draggableObject.deactivateDraggableObject();
    },
    registerDragTarget: function(dragTarget) {
        this.dragTargets.push(dragTarget);
    },
    registerDragProxy: function(dragProxy) {
        this.dragProxies.push(dragProxy);
        dragProxy.initializeDragProxy();
    },
    startDrag: function(draggableObject, startX, startY) {
        this.draggingObject = draggableObject;
        var draggableElement = draggableObject.element;
        var draggingElementOffsets = draggableElement.offset();
        this.dragStartOffsets = {
            left: startX - draggingElementOffsets.left,
            top: startY - draggingElementOffsets.top
        };
        this.boundingOffsets = draggableElement.parent().offset();
        var body = JQuery('body');
        body.on("touchmove mousemove", this.handleDragMove);
        body.on("touchend mouseup", this.handleDragRelease);

        this.dragTargets.forEach(function(dragTarget) {
            dragTarget.startDrag();
        });
        this.dragProxies.forEach(function(dragProxy) {
            dragProxy.startDrag();
        });
        draggableObject.startDrag();
    },
    moveDrag: function(clientX, clientY) {
        var x = clientX - this.boundingOffsets.left - this.dragStartOffsets.left;
        var y = clientY - this.boundingOffsets.top - this.dragStartOffsets.top;
        var element = this.draggingObject.element;
        element.css("left", x + "px");
        element.css("top", y + "px");
    },
    releaseDrag: function() {
        var body = JQuery('body');
        body.off("touchmove mousemove", this.handleDragMove);
        body.off("touchend mouseup", this.handleDragRelease);

        this.dragTargets.forEach(function(dragTarget) {
            dragTarget.releaseDrag();
        });
        this.dragProxies.forEach(function(dragProxy) {
            dragProxy.releaseDrag();
        });

        this.draggingObject.releaseDrag();

        this.dragStartOffsets = null;
        this.draggingObject = null;
        this.boundingOffsets = null;
    },
    clearProxies: function() {
        this.dragProxies.forEach(function(dragProxy) {
            dragProxy.uninitializeDragProxy();
        });
        this.dragProxies = [];
    },
    indexOf: function(dragProxy) {
        for (var i = 0, size = this.dragProxies.length; i < size; i++) {
            var dragProxyAt = this.dragProxies[i];
            if (dragProxyAt.name === dragProxy.name) {
                return i;
            }
        }
    },
    removeProxy: function(dragProxy) {
        var index = this.indexOf(dragProxy);
        if (index > -1) {
            this.dragProxies.splice(index, 1);
            dragProxy.uninitializeDragProxy();
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.DragManager', DragManager);
