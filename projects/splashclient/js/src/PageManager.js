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

//@Export('splash.PageManager')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var Map                 = bugpack.require('Map');


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
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Page}
         */
        getCurrentPage: function() {
            return this.currentPage;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
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
});
