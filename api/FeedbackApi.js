//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var FeedbackModel = require('../models/FeedbackModel.js');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var FeedbackApi = {

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

        //TEST
        console.log("createFeedback api call");
        for(var property in data){
            console.log(property + ' : ' + data[property]);
        }

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

    findAllFeedbacks: function(callback) {
        var query = DeedbackModel.find();
        query.exec(function(error, feedbacks) {
            callback(error, feedbacks);
        });
    }
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

module.exports = FeedbackApi;
