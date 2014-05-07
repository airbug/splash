//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.DragManager')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('jquery.JQuery')
//@Require('splash.DragProxy')
//@Require('splash.IDraggable')
//@Require('splash.IDragTarget')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug     = bugpack.require('ArgumentBug');
var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var Set             = bugpack.require('Set');
var JQuery          = bugpack.require('jquery.JQuery');
var DragProxy       = bugpack.require('splash.DragProxy');
var IDraggable      = bugpack.require('splash.IDraggable');
var IDragTarget     = bugpack.require('splash.IDragTarget');


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

        this.boundingOffsets    = null;

        /**
         * @private
         * @type {IDraggable}
         */
        this.draggingDraggable  = null;

        this.dragStartOffsets   = null;

        /**
         * @private
         * @type {Set.<IDraggable>}
         */
        this.draggableSet       = new Set();

        /**
         * @private
         * @type {Set.<DragProxy>}
         */
        this.dragProxySet       = new Set();

        /**
         * @private
         * @type {Set.<IDragTarget>}
         */
        this.dragTargetSet      = new Set();

        /**
         * @private
         * @type {number}
         */
        this.lastX              = undefined;

        /**
         * @private
         * @type {number}
         */
        this.lastY              = undefined;


        //-------------------------------------------------------------------------------
        // JQuery Event Listeners
        //-------------------------------------------------------------------------------

        var _this = this;

        this.handleDragMove = function(event) {
            var originalEvent = event.originalEvent;
            var x = undefined;
            var y = undefined;
            if (originalEvent.type === "touchmove") {
                x = originalEvent.touches[0].pageX;
                y = originalEvent.touches[0].pageY;
            } else {
                y = event.clientY;
                x = event.clientX;
            }

            console.log("Move drag - x:", x, " y:", y, " event.type:", event.type);
            _this.moveDrag(x, y);
        };

        this.handleDragRelease = function() {
            _this.releaseDrag();
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} name
     * @param {JQuery} element
     * @param {IDraggable} draggable
     */
    createDragProxy: function(name, element, draggable) {
        var dragProxy = new DragProxy(name, element, draggable, this);
        this.registerDragProxy(dragProxy);
    },

    /**
     * @param {IDraggable} draggable
     */
    registerDraggable: function(draggable) {
        if (!Class.doesImplement(draggable, IDraggable)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "draggable", draggable, "parameter must implement IDraggable");
        }
        if (!this.draggableSet.contains(draggable)) {
            this.draggableSet.add(draggable);
            draggable.initializeDraggable();
        }
    },

    /**
     * @param {IDraggable} draggable
     */
    deregisterDraggable: function(draggable) {
        if (this.draggableSet.contains(draggable)) {
            this.draggableSet.remove(draggable);
            draggable.deinitializeDraggable();
        }
    },

    /**
     * @param {IDragTarget} dragTarget
     */
    registerDragTarget: function(dragTarget) {
        if (!Class.doesImplement(dragTarget, IDragTarget)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "dragTarget", dragTarget, "parameter must implement IDragTarget");
        }
        if (!this.dragTargetSet.contains(dragTarget)) {
            this.dragTargetSet.add(dragTarget);
        }
    },

    /**
     * @param {DragProxy} dragProxy
     */
    deregisterDragProxy: function(dragProxy) {
        if (this.dragProxySet.contains(dragProxy)) {
            this.dragProxySet.remove(dragProxy);
            dragProxy.deinitializeDragProxy();
        }
    },

    /**
     * @param {DragProxy} dragProxy
     */
    registerDragProxy: function(dragProxy) {
        if (!this.dragProxySet.contains(dragProxy)) {
            this.dragProxySet.add(dragProxy);
            dragProxy.initializeDragProxy();
        }
    },

    /**
     * @param {IDraggable} draggable
     * @param {number} startX
     * @param {number} startY
     */
    startDrag: function(draggable, startX, startY) {
        this.lastX = startX;
        this.lastY = startY;
        this.draggingDraggable = draggable;

        //TODO BRN: This is a total hack here. To do this properly, IDraggable should extend IEventDispatcher and should emit an event

        var draggableElement = draggable.element;
        var draggingElementOffsets = draggableElement.offset();
        this.dragStartOffsets = {
            left: startX - draggingElementOffsets.left,
            top: startY - draggingElementOffsets.top
        };
        this.boundingOffsets = draggableElement.parent().offset();
        var body = JQuery('body');
        body.on("touchmove mousemove", this.handleDragMove);
        body.on("touchend mouseup", this.handleDragRelease);

        this.dragTargetSet.forEach(function(dragTarget) {
            dragTarget.startDrag();
        });
        this.dragProxySet.forEach(function(dragProxy) {
            dragProxy.startDrag();
        });
        draggable.startDrag();
    },
    moveDrag: function(clientX, clientY) {
        this.lastX = clientX;
        this.lastY = clientY;
        var x = clientX - this.boundingOffsets.left - this.dragStartOffsets.left;
        var y = clientY - this.boundingOffsets.top - this.dragStartOffsets.top;

        //TODO BRN: Another hack

        var element = this.draggingDraggable.element;
        element.css("left", x + "px");
        element.css("top", y + "px");
    },
    releaseDrag: function() {
        var body = JQuery('body');
        body.off("touchmove mousemove", this.handleDragMove);
        body.off("touchend mouseup", this.handleDragRelease);

        this.dragTargetSet.forEach(function(dragTarget) {
            dragTarget.releaseDrag();
        });
        this.dragProxySet.forEach(function(dragProxy) {
            dragProxy.releaseDrag();
        });

        this.draggingDraggable.releaseDrag();
        this.calculateDrop(this.draggingDraggable, this.lastX, this.lastY);
        this.dragStartOffsets   = null;
        this.draggingDraggable  = null;
        this.boundingOffsets    = null;
        this.lastX              = undefined;
        this.lastY              = undefined;
    },

    /**
     *
     */
    clearProxies: function() {
        this.dragProxySet.forEach(function(dragProxy) {
            dragProxy.deinitializeDragProxy();
        });
        this.dragProxySet.clear();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {IDraggable} droppedDraggable
     * @param {number} dropX
     * @param {number} dropY
     */
    calculateDrop: function(droppedDraggable, dropX, dropY) {

        //TEST
        console.log("calculateDrop - dropX:", dropX, " dropY:", dropY);

        var element = JQuery(document.elementFromPoint(dropX, dropY));
        var target = this.findTargetWithElement(element);
        if (target) {
            target.processTargetedDrop(droppedDraggable);
        }
    },

    /**
     * @private
     * @param {JQuery} element
     * @return {IDragTarget}
     */
    findTargetWithElement: function(element) {
        var iterator    = this.dragTargetSet.iterator();
        while (iterator.hasNext()) {
            var dragTarget  = iterator.next();
            var result      = element.closest(dragTarget.element.get(0));

            //TEST
            console.log("result.length:", result.length, " result:", result);

            if (result.length) {
                return dragTarget;
            }
        }
        return undefined;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.DragManager', DragManager);
