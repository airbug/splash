var bugpackApi = require('bugpack');
bugpackApi.loadContext("", function(error, bugpack) {
    if (!error) {
        var SplashApplication = bugpack.require('splash.SplashApplication');
        var application = new SplashApplication();
        application.start(function(error) {
            if (error) {
                console.log(error);
                console.log(error.stack);
            }
        });
    } else {
        console.log(error);
        console.log(error.stack)
    }
});
