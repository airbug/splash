//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var BetaSignUpModel = require('../models/BetaSignUpModel.js');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BetaSignUpApi = {

    /**
     * @param {{
     *      company: string,
     *      companySize: string,
     *      email: string,
     *      name: string,
     *      phoneNumber: string,
     *      position: string,
     *      wishList: Array.<string>
     * }} data
     * @param {function(Error, BetaSignUpModel)} callback
     */
    createBetaSignUp: function(data, callback) {
        //TODO BRN: Add validation of params

        var betaSignUp = {
            company: data.company,
            companySize: data.companySize,
            email: data.email,
            name: data.name,
            phoneNumber: data.phoneNumber,
            position: data.position,
            wishList: data.wishList
        };
        var betaSignUpModel = new BetaSignUpModel(betaSignUp);
        betaSignUpModel.save(function(error, result) {
            if(error){
                callback(new Error('betaSignUp failed to save'));
            } else {
                callback(null, result);
            }
        });
    },

    findAllBetaSignUps: function(callback) {
        var query = BetaSignUpModel.find();
        query.exec(function(error, betaSignUps) {
            callback(error, betaSignUps);
        });
    }
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

module.exports = BetaSignUpApi;
