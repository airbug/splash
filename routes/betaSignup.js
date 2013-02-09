
/*
 * POST beta-signup.
 */

exports.betaSignup = function(req, res){
  betaSignupDBClient.save(req.body, function(){
    if (error){
      res.send('error');
      res.end();
    } else {
      res.send('success');
      res.end();
    }
  });
};