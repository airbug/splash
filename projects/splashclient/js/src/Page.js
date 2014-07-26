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

//@Export('splash.Page')

//@Require('Class')
//@Require('Obj')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');
    var JQuery  = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    var Page = Class.extend(Obj, {

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
             * @type {boolean}
             */
            this.active = false;

            /**
             * @private
             * @type {JQuery}
             */
            this.element = element;

            /**
             * @private
             * @type {boolean}
             */
            this.initialized = false;

            /**
             * @private
             * @type {string}
             */
            this.name = name;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {JQuery}
         */
        getElement: function() {
            return this.element;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} pageTransition
         */
        activate: function(pageTransition) {
            this.active = true;
            this.element.removeClass("page-slide-out-to-bottom-and-hide");
            this.element.removeClass("page-slide-out-to-top-and-hide");
            this.element.removeClass("page-slide-in-from-top");
            this.element.removeClass("page-slide-in-from-bottom");
            this.element.removeClass("page-slide-in-from-left");
            this.element.removeClass("page-slide-in-from-right");
            this.element.removeClass("page-slide-out-to-left-and-hide");
            this.element.removeClass("page-slide-out-to-right-and-hide");
            if (pageTransition === "slidedown") {
                this.element.addClass("page-slide-in-from-top");
            } else if (pageTransition === "slideup") {
                this.element.addClass("page-slide-in-from-bottom");
            } else if (pageTransition === "slideleft"){
                this.element.addClass("page-slide-in-from-right")
            } else if(pageTransition === "slideright"){
                this.element.addClass("page-slide-in-from-left")
            }
            this.element.css("visibility", "visible");
            this.element.css("height", "auto");
            JQuery(window).scrollTop(0);

        },

        /**
         * @param {string} pageTransition
         */
        deactivate: function(pageTransition) {
            this.active = false;
            this.element.removeClass("page-slide-out-to-bottom-and-hide");
            this.element.removeClass("page-slide-out-to-top-and-hide");
            this.element.removeClass("page-slide-in-from-top");
            this.element.removeClass("page-slide-in-from-bottom");
            this.element.removeClass("page-slide-in-from-left");
            this.element.removeClass("page-slide-in-from-right");
            this.element.removeClass("page-slide-out-to-left-and-hide");
            this.element.removeClass("page-slide-out-to-right-and-hide");
            if (pageTransition === "slidedown") {
                this.element.addClass("page-slide-out-to-bottom-and-hide");
            } else if (pageTransition === "slideup") {
                this.element.addClass("page-slide-out-to-top-and-hide")
            } else if (pageTransition === "slideleft"){
                this.element.addClass("page-slide-out-to-left-and-hide")
            } else if(pageTransition === "slideright"){
                this.element.addClass("page-slide-out-to-right-and-hide")
            }
            this.element.css("visibility", "hidden");
            this.element.css("height", "0");
        },

        /**
         *
         */
        initialize: function() {
            this.initialized = true;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.Page', Page);
});
