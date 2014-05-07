//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.Arrow')

//@Require('Class')
//@Require('Obj')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var JQuery =    bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Arrow = Class.extend(Obj, {

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
         * @type {JQuery}
         */
        this.element = JQuery(".arrow-container");
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    hide: function() {
        this.element.hide();
    },

    /**
     *
     */
    show: function() {
        this.element.show();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.Arrow', Arrow);
