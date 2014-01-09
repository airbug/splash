//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('ThankYouPage')

//@Require('Class')
//@Require('jquery.JQuery')
//@Require('splash.Page')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var JQuery =        bugpack.require('jquery.JQuery');
var Page =          bugpack.require('splash.Page');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ThankYouPage = Class.extend(Page, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("thankYouPage", JQuery("#thank-you-page"));


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        this.betaSignUpPage = null;

        this.thankYouPage = null;
    },


    //-------------------------------------------------------------------------------
    // Page Methods
    //-------------------------------------------------------------------------------
    activate: function(pageTransition) {
        this._super(pageTransition);
        JQuery('#beta-sign-up-button-one').hide();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ThankYouPage', ThankYouPage);
