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

//@Export('splash.Tracker')

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

    var Tracker = Class.extend(Obj, {

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
             * @type {Object}
             */
            this.config = null;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        configure: function(config) {
            this.config = config;
        },
        trackAppLoad: function() {
            this.trackGA("App", "Load");
        },
        trackGoalComplete: function(goalName) {
            this.trackGA("Goal", "Complete", goalName);
        },
        trackPageView: function(pageId) {
            this.trackGA("Page", "View", pageId);
        },
        trackGA: function(category, action, label, value, nonInteraction) {
            if (this.config && this.config.production) {
                _gaq.push(['_trackEvent', category, action, label, nonInteraction]);
            } else {
                console.log("TackingEvent - category:" + category + " action:" + action +
                    " label:" + label + " nonInteraction:" + nonInteraction);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.Tracker', Tracker);
});
