//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.BetaSignUpApi')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('splash.BetaSignUpModel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var mailchimp           = require('mailchimp-api');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var BetaSignUpModel     = bugpack.require('splash.BetaSignUpModel');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var Mailchimp           = mailchimp.Mailchimp;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var BetaSignUpApi = Class.extend(Obj, {

        _name: "splash.BetaSignUpApi",


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

            /**
             * @private
             * @type {Config}
             */
            this.config         = null;

            /**
             * @private
             * @type {null}
             */
            this.mcApi          = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Config}
         */
        getConfig: function() {
            return this.config;
        },

        /**
         * @param {Config} config
         */
        setConfig: function(config) {
            this.config = config;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

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
         * @param {function(Throwable, BetaSignUpModel=)} callback
         */
        createBetaSignUp: function(data, callback) {
            //TODO BRN: Add validation of params

            var _this = this;
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
                if (error) {
                    callback(new Bug('MongoError', {}, 'betaSignUp failed to save', [error]));
                } else {
                    var mcApi           = _this.generateMailChimpApi();
                    var firstLastObject = _this.parseName(data.name);
                    var listId          = _this.config.getProperty("mailchimp.listId");
                    mcApi.lists.subscribe({id: listId, email:{email:data.email}, double_optin: false, merge_vars:{fname:firstLastObject.firstName,lname:firstLastObject.lastName}}, function (data) {
                        console.log(data);
                    }, function(error) {
                        console.log(error);
                    });
                    callback(null, result);
                }
            });
        },

        /**
         * @param callback
         */
        findAllBetaSignUps: function(callback) {
            var query = BetaSignUpModel.find();
            query.exec(function(error, betaSignUps) {
                callback(error, betaSignUps);
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {Mailchimp}
         */
        generateMailChimpApi: function() {
            if (!this.mcApi) {
                this.mcApi = new Mailchimp(this.config.getProperty("mailchimp.apiKey"));
            }
            return this.mcApi;
        },

        /**
         * @private
         * @param {string} fullName
         * @returns {{firstName: (Array|*), lastName: string}}
         */
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
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.BetaSignUpApi', BetaSignUpApi);
});
