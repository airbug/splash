var Schema = require('mongoose').Schema;
var db = require('../db.js').db;

var betaSignUpSchema = new Schema({
    emailAddress: String, //TODO: Create clientside validation of email address
    wishlist: {
        // source control
        github: Boolean,
        
        // bugtracking
        jira: Boolean,
        zendesk: Boolean,
        
        // project management
        pivotaltracker: Boolean,
        asana: Boolean,
        basecamp: Boolean,
        
        // file and note storage
        dropbox: Boolean,
        evernote: Boolean,
        
        // social media
        facebook: Boolean,
        twitter: Boolean,
        
        // other
        email: Boolean,
        texteditor: Boolean,
        other: String  //TODO: Be able to take in multiple other fields and store as an array of strings
    }
});

var BetaSignUp = db.model('BetaSignUp', betaSignUpSchema);
BetaSignUp.on('error', function(error){
   console.log("BetaSignUp Error: " + error); 
});

exports.BetaSignUp = BetaSignUp;