//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.BetaSignUpModel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var mongoose = require('mongoose');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    var BetaSignUpSchema = new mongoose.Schema({
        company: String,
        companySize: String,
        email: String,
        name: String,
        phoneNumber: String,
        position: String,
        wishList: [String]
    });

    var BetaSignUpModel = mongoose.model("BetaSignUp", BetaSignUpSchema);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.BetaSignUpModel', BetaSignUpModel);
});
