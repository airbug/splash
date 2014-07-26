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

//@Export('splash.DragProxy')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    var DragProxy = Class.extend(Obj, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @param {string} name
         * @param {Element} element
         * @param {IDraggable} draggable
         * @param {DragManager} dragManager
         * @private
         */
        _constructor: function(name, element, draggable, dragManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IDraggable}
             */
            this.draggable      = draggable;

            /**
             * @private
             * @type {DragManager}
             */
            this.dragManager    = dragManager;

            /**
             * @private
             * @type {Element}
             */
            this.element        = element;

            /**
             * @private
             * @type {string}
             */
            this.name           = name;

            var _this = this;
            this._handle = function(event) {
                _this.handleInteractionStart(event);
            };
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        setup: function() {
            this.dragManager.registerDraggable(this);
        },

        /**
         *
         */
        initializeDragProxy: function() {
            this.element.on("touchstart mousedown", this._handle);
            this.element.addClass("grab");
        },

        /**
         *
         */
        deinitializeDragProxy: function() {
            this.element.off("touchstart mousedown", this._handle);
            this.element.removeClass("grab");
            this.element.removeClass("grabbing");
        },

        /**
         *
         */
        startDrag: function() {
            this.element.addClass("grabbing");
            this.element.removeClass("grab");
        },

        /**
         *
         */
        releaseDrag: function() {
            this.element.addClass("grab");
            this.element.removeClass("grabbing");
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        handleInteractionStart: function(event) {
            event.preventDefault();
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

            this.dragManager.startDrag(this.draggable, x, y);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.DragProxy', DragProxy);
});
