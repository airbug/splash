//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var mongoose = require('mongoose');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var FeedbackSchema = new mongoose.Schema({
    anythingConfusing: String,
    biggestConcern: String,
    currentPage: String,
    helpSolve: String,
    stoppingSignUp: String,
    whatElse: String
});

var FeedbackModel = mongoose.model("Feedback", FeedbackSchema);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

module.exports = FeedbackModel;
