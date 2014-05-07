//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.FeedbackApi')

//@Require('Class')
//@Require('Obj')
//@Require('splash.FeedbackModel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var FeedbackModel   = bugpack.require('splash.FeedbackModel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var FeedbackApi = Class.extend(Obj, {

        _name: "splash.FeedbackApi",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *      anythingConfusing: string,
         *      biggestConcern: string,
         *      currentPage: string,
         *      helpSolve: string,
         *      stoppingSignUp: string,
         *      whatElse: string
         * }} data
         * @param {function(Error, FeedbackModel)} callback
         */
        createFeedback: function(data, callback) {
            //TODO BRN: Add validation of params

            var feedback = {
                anythingConfusing: data.anythingConfusing,
                biggestConcern: data.biggestConcern,
                currentPage: data.currentPage,
                helpSolve: data.helpSolve,
                stoppingSignUp: data.stoppingSignUp,
                whatElse: data.whatElse
            };
            var feedbackModel = new FeedbackModel(feedback);
            feedbackModel.save(function(error, result) {
                if (error) {
                    callback(new Error('feedback failed to save'));
                } else {
                    callback(null, result);
                }
            });
        },

        /**
         * @param {function(Error, Array.<FeedbackModel>)} callback
         */
        findAllFeedbacks: function(callback) {
            var query = FeedbackModel.find();
            query.exec(function(error, feedbacks) {
                callback(error, feedbacks);
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.FeedbackApi', FeedbackApi);
});
