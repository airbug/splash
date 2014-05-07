//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.PageManager')

//@Require('Class')
//@Require('Map')
//@Require('EventDispatcher')
//@Require('Event')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Map =       bugpack.require('Map');
var EventDispatcher =       bugpack.require('EventDispatcher');
var Event =     bugpack.require('Event');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PageManager = Class.extend(EventDispatcher, {

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
         * @type {Page}
         */
        this.currentPage = null;

        /**
         * @private
         * @type {Map.<string, Page>}
         */
        this.pages = new Map();

        /**
         * @private
         * @type {Tracker}
         */
        this.tracker = null;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Page}
     */
    getCurrentPage: function() {
        return this.currentPage;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} pageName
     * @param {string} pageTransition
     */
    goToPage: function(pageName, pageTransition) {
        var page = this.pages.get(pageName);
        if (page) {
            var previousPage = this.currentPage;
            if (previousPage) {
                previousPage.deactivate(pageTransition);
            }
            page.activate(pageTransition);
            this.currentPage = page;
            this.tracker.trackPageView(page.getName());
            console.log("dispatching gotoPage event");
            this.dispatchEvent(new Event(PageManager.EventTypes.GOTOPAGE, {currentPage: this.currentPage}));
        }
    },

    /**
     * @param {Page} page
     */
    registerPage: function(page) {
        this.pages.put(page.getName(), page);
        page.initialize();
    }
});

PageManager.EventTypes = {GOTOPAGE: "pageManagereventType::goToPage"} 

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.PageManager', PageManager);
