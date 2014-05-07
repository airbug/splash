/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */

//-------------------------------------------------------------------------------
// Closure
//-------------------------------------------------------------------------------

(function(window) {

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
                bugpack.loadExports(["splash.SplashApplication"], function(error) {
                    var SplashApplication = bugpack.require('splash.SplashApplication');
                    var application = new SplashApplication();
                    application.start(function(error) {
                        if (error) {
                            console.log(error);
                            console.log(error.stack);
                        }
                    });
                });
            } else {
                console.log(error);
                console.log(error.stack)
            }
        });
    }
})(window);
