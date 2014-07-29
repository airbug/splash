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


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var JQuery  = bugpack.require('jquery.JQuery');
    var Page    = bugpack.require('splash.Page');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Page}
     */
    var PrivacyPage = Class.extend(Page, {

        _name: "splash.PrivacyPage",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {
            this._super("privacyPage", JQuery(".terms-background"));
        },


        //-------------------------------------------------------------------------------
        // Page Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} pageTransition
         */
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
