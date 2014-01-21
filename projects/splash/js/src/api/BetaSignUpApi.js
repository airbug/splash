//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('BetaSignUpApi')

//@Require('splash.BetaSignUpModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BetaSignUpModel =   bugpack.require('splash.BetaSignUpModel');


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

                var firstLastObject = BetaSignUpApi.parseName(data.name);
                var MailChimpAPI = require('mailchimp-api').Mailchimp;
                var apiKey = '14beaa52ddae3fc5cd626d998cdf83b9-us3';
                var listID = 'f3e9d861ec';

                try {
                    var mcApi = new MailChimpAPI(apiKey);
                } catch (error) {
                    console.log(error.message);
                }

                mcApi.lists.subscribe({id: listID, email:{email:data.email}, double_optin: false, merge_vars:{fname:firstLastObject.firstName,lname:firstLastObject.lastName}}, function (error, data) {
                    if (error){
                        console.log(error);
                    }
                    else {
                        console.log(data);
                    }
                });

                callback(null, result);
            }
        });
    },

    findAllBetaSignUps: function(callback) {
        var query = BetaSignUpModel.find();
        query.exec(function(error, betaSignUps) {
            callback(error, betaSignUps);
        });
    },

    parseName: function(fullName) {

        var firstName = fullName.split(" ", 1);
        firstName = firstName.join(" ");
        console.log(firstName);

        var lastNameParts = fullName.split(" ")
        lastNameParts.shift();
        var lastName = lastNameParts.join(" ");
        console.log(lastName);

        return {
            firstName: firstName,
            lastName: lastName
        };
    }

};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.BetaSignUpApi', BetaSignUpApi);
