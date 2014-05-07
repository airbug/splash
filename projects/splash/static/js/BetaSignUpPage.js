//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.BetaSignUpPage')

//@Require('Class')
//@Require('jquery.JQuery')
//@Require('splash.Airbug')
//@Require('splash.Page')


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

var BetaSignUpPage = Class.extend(Page, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("betaSignUpPage", JQuery("#beta-sign-up-page"));


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugJar}
         */
        this.airbugJar = null;

        /**
         * @private
         * @type {Array.<Airbug>}
         */
        this.airbugs = [
            new Airbug("basecamp", JQuery("#airbug-basecamp-container")),
            new Airbug("bitbucket", JQuery("#airbug-bitbucket-container")),
            new Airbug("github", JQuery("#airbug-github-container")),
            new Airbug("jira", JQuery("#airbug-jira-container")),
            new Airbug("pivotaltracker", JQuery("#airbug-pivotaltracker-container")),
            new Airbug("salesforce", JQuery("#airbug-salesforce-container")),
            new Airbug("uservoice", JQuery("#airbug-uservoice-container")),
            new Airbug("zendesk", JQuery("#airbug-zendesk-container"))
        ];

        /**
         * @private
         * @type {BetaSignUpModal}
         */
        this.betaSignUpModal = null;

        /**
         * @private
         * @type {DragManager}
         */
        this.dragManager = null;

        /**
         * @private
         * @type {OtherAirbugForm}
         */
        this.otherAirbugForm = null;

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


        //-------------------------------------------------------------------------------
        // JQuery Event Handlers
        //-------------------------------------------------------------------------------

        var _this = this;

        this.handleNavPullDownClick = function(event) {
            _this.pageManager.goToPage("explainerPage", "slideright");
        };
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initialize: function() {
        this._super();
        this.airbugs.forEach(function(airbug) {
            airbug.setup();
        });
        this.dragManager.registerDragTarget(this.airbugJar);
        this.betaSignUpModal.initialize();
        this.otherAirbugForm.initialize();
        JQuery('#nav-pull-down-tab').on('click', this.handleNavPullDownClick);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.BetaSignUpPage', BetaSignUpPage);
