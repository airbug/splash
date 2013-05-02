//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('PageManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Map =       bugpack.require('Map');
var Obj =       bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PageManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.PageManager', PageManager);
