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

//@Export('splash.AirbugJar')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('jquery.JQuery')
//@Require('splash.IDragTarget')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var JQuery              = bugpack.require('jquery.JQuery');
    var IDragTarget         = bugpack.require('splash.IDragTarget');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     * @extends {EventDispatcher}
     */
    var AirbugJar = Class.extend(EventDispatcher, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
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

            /**
             * @private
             * @type {JQuery}
             */
            this.instructionsContainer = JQuery("#instructions-container")
        },


        //-------------------------------------------------------------------------------
        // IDragTarget Implementation
        //-------------------------------------------------------------------------------

        /**
         *
         */
        startDrag: function() {
            this.element.addClass("grabbing");
        },

        /**
         *
         */
        releaseDrag: function() {
            this.element.removeClass("grabbing");
        },

        /**
         * @param {IDraggable} draggable
         */
        processTargetedDrop: function(draggable) {

            //TEST
            console.log("processTargetedDrop - draggable:", draggable);

            this.addAirbug(draggable);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
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
                this.instructionsContainer.addClass("hide-instructions");
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
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AirbugJar, IDragTarget);



    //-------------------------------------------------------------------------------
    // Static Properties
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
});
