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

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var bugpack = require("bugpack");


    //-------------------------------------------------------------------------------
    // Script Functions
    //-------------------------------------------------------------------------------

    /**
     * @param {BugPackContext} bugpack
     */
    var startApplication = function(bugpack) {

        //-------------------------------------------------------------------------------
        // BugPack
        //-------------------------------------------------------------------------------

        var Application                 = bugpack.require("bugapp.Application");
        var SplashClientApplication     = bugpack.require("splash.SplashClientApplication");


        //-------------------------------------------------------------------------------
        // Script
        //-------------------------------------------------------------------------------

        var application         = new SplashClientApplication();
        window.application      = application;
        application.addEventListener(Application.EventTypes.STARTED, function (event) {
            console.log("SplashClientApplication successfully started");
        });
        application.addEventListener(Application.EventTypes.ERROR, function (event) {
            throw event.getData().error;
        });

        application.start();
    };

    /**
     * @return {number}
     */
    var getInternetExplorerVersion = function() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        return rv;
    };


    //-------------------------------------------------------------------------------
    // Context
    //-------------------------------------------------------------------------------

    if (getInternetExplorerVersion() !== -1) {
        var elem = document.getElementById("airbug-loader");
        elem.style.display = "none";
        var betaHide = document.getElementById("beta-sign-up-button-one");
        betaHide.style.display = "none";
    } else {
        if (!_appConfig.js.concat) {

            //NOTE BRN: In debug mode we need to load the bugpack-registry.json so that we can load all files individually

            bugpack.loadContext(_appConfig.staticUrl + "/js/client", function(error, bugpack) {
                if (!error) {
                    bugpack.loadExports(["bugapp.Application", "splash.SplashClientApplication"], function(error) {
                        if (!error) {
                            startApplication(bugpack);
                        } else {
                            throw error;
                        }
                    });
                } else {
                    throw error;
                }
            });

        } else {

            // NOTE BRN: When we're not in debug mode, the classes have already been loaded in a separate file and placed
            // in the default context. So we can just jump right in and start requiring classes.

            bugpack.context("*", function (bugpack) {
                startApplication(bugpack);
            });
        }
    }
})(window);

