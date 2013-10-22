//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('ExplainerPage')

//@Require('Class')
//@Require('jquery.JQuery')
//@Require('splash.Page')
//@Require('splash.PageManager')
//@Require('splitbug.Splitbug')


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

var ExplainerPage = Class.extend(Page, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("explainerPage", JQuery("#explainer-page"));


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PageManager}
         */
        this.pageManager = null;

        /**
         * @private
         * @type {Splitbug}
         */
        this.splitbug = null;
    },


    //-------------------------------------------------------------------------------
    // Page Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initialize: function() {
        this._super();

        var _this = this;
        var marketingTaglineHeader = JQuery("#marketing-tagline-header");
        this.splitbug.splitTest({
            name: "alternate-tag-line",
            controlFunction: function() {
                marketingTaglineHeader.html("Unite and motivate your team's cross-platform collaboration");
            },
            testFunction: function() {
                marketingTaglineHeader.html("Collaborative chat for developers");
            }
        });

        var betaSignUpButton = JQuery("#beta-sign-up-button");
        betaSignUpButton.on("click", function(event) {
            _this.pageManager.goToPage("betaSignUpPage", "slideleft");
        });

    },

    /**
     *
     */
    activate: function(pageTransition) {
        this._super(pageTransition);
        var loadingPage = JQuery("#loading-page");
        loadingPage.hide();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.ExplainerPage', ExplainerPage);
