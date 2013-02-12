
/*
 * POST beta-signup.
 */
 
var BetaSignUp = require('../models/BetaSignUp.js').BetaSignUp;

exports.create = function(req, res){
    for(var property in req.body){
        console.log(property + ' : ' + req.body[property]);
    }
    var betaSignUp = BetaSignUp.create(formatForMongo(req.body), function(error, betaSignUp){
        if(error){
            console.log(new Error('betaSignUp failed to save'));
            res.send('error: beta-signup failed to save');
            res.end();
        } else {
            console.log('betaSignUp saved successfully: ' + betaSignUp.toString())
            res.send('success');
            res.end();
        }
    });
};

var formatForMongo = function(requestBody){
  return {
      emailAddress: requestBody.emailAddress,
      wishlist: {
          github: requestBody.github || false,
          jira: requestBody.jira || false,
          zendesk: requestBody.zendesk || false,
          pivotaltracker: requestBody.pivotaltracker || false,
          asana: requestBody.asana || false,
          basecamp: requestBody.basecamp || false,
          dropbox: requestBody.dropbox || false,
          evernote: requestBody.evernote || false,
          facebook: requestBody.facebook || false,
          twitter: requestBody.twitter || false,
          email: requestBody.email || false,
          texteditor: requestBody.texteditor || false,
          other: requestBody.other || ''
      }
  };
};