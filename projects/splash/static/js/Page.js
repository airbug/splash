//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('Page')

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

var Page = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(name, element) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
    // Class Methods
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
        if (pageTransition === "slidedown") {
            this.element.addClass("page-slide-in-from-top");
        } else if (pageTransition === "slideup") {
            this.element.addClass("page-slide-in-from-bottom");
        }
        this.element.css("visibility", "visible");
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
        if (pageTransition === "slidedown") {
            this.element.addClass("page-slide-out-to-bottom-and-hide");
        } else if (pageTransition === "slideup") {
            this.element.addClass("page-slide-out-to-top-and-hide")
        }
        this.element.css("visibility", "hidden");
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
