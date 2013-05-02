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
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.betaSignUpPage = null;

        this.thankYouPage = null;
    }


    //-------------------------------------------------------------------------------
    // Page Methods
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ThankYouPage', ThankYouPage);