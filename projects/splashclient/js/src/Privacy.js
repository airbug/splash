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

//@Export('splash.PrivacyPage')

//@Require('Class')
//@Require('jquery.JQuery')
//@Require('splash.Page')
//@Require('splash.PageManager')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var JQuery  = bugpack.require('jquery.JQuery');
    var Airbug  = bugpack.require('splash.Airbug');
    var Page    = bugpack.require('splash.Page');


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
});
