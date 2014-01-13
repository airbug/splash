function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    return rv;
}

var internetExplorer = getInternetExplorerVersion();

if (internetExplorer !== -1) {
    var elem = document.getElementById("airbug-loader");
    elem.style.display = "none";
    var betaHide = document.getElementById("beta-sign-up-button-one");
    betaHide.style.display = "none";
} else {
    var bugpackApi = require('bugpack');
    bugpackApi.loadContext(_appConfig.staticUrl, function(error, bugpack) {
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
}
