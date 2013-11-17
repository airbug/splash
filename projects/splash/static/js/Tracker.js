//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('Tracker')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


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

        /**
         * @private
         * @type {SonarbugClient}
         */
        this.sonarbugClient = null;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    configure: function(config) {
        this.config = config;
    },
    trackAppLoad: function() {
        this.trackGA("App", "Load");
        this.trackSB("appLoad", null);
    },
    trackGoalComplete: function(goalName) {
        this.trackGA("Goal", "Complete", goalName);
        this.trackSB("goalComplete", {goalName: goalName});
    },
    trackPageView: function(pageId) {
        this.trackGA("Page", "View", pageId);
        this.trackSB("pageView", {pageId: pageId});
    },
    trackGA: function(category, action, label, value, nonInteraction) {
        if (this.config && this.config.production) {
            _gaq.push(['_trackEvent', category, action, label, nonInteraction]);
        } else {
            console.log("TackingEvent - category:" + category + " action:" + action +
                " label:" + label + " nonInteraction:" + nonInteraction);
        }
    },
    trackSB: function(eventName, data){
        this.sonarbugClient.track(eventName, data);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.Tracker', Tracker);
