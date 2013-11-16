//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('splash.SplashServerApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var SplashServerApplication = bugpack.require('splash.SplashServerApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var splashServerApplication = new SplashServerApplication();
splashServerApplication.start(function(error) {
    console.log("Starting splash server...");
    if (!error){
        console.log("Splash server successfully started");
    } else {
        console.error(error.toString());
        console.error(error.stack);
        process.exit(1);
    }
});
