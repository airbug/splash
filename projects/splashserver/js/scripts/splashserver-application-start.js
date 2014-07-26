/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require("bugpack").loadContext(module, function(error, bugpack) {
    if (!error) {
        bugpack.loadExports(["splash.SplashServerApplication"], function(error) {
            if (!error) {

                //-------------------------------------------------------------------------------
                // BugPack
                //-------------------------------------------------------------------------------

                var SplashServerApplication     = bugpack.require("splash.SplashServerApplication");


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

            } else {
                console.log(error.message);
                console.log(error.stack);
                process.exit(1);
            }
        });
    } else {
        console.log(error.message);
        console.log(error.stack);
        process.exit(1);
    }
});
