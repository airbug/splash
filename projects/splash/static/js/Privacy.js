//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('PrivacyPage')

//@Require('Class')
//@Require('jquery.JQuery')
//@Require('splash.Page')
//@Require('splash.PageManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var JQuery =    bugpack.require('jquery.JQuery');
var Airbug =    bugpack.require('splash.Airbug');
var Page =      bugpack.require('splash.Page');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PrivacyPage = Class.extend(Page, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("privacyPage", JQuery(".terms-background"));


    },

    activate: function(pageTransition) {
        this._super(pageTransition);
        JQuery('#loading-page').hide();
        JQuery('#beta-sign-up-button-one').hide();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.PrivacyPage', PrivacyPage);
