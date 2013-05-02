var bugpackApi = require('bugpack');
bugpackApi.loadContext("", function(error, bugpack) {
    if (!error) {
        var SplashApplication = bugpack.require('splash.SplashApplication');
        var application = new SplashApplication();
        application.start();
    } else {
        console.error(error);
    }
});
