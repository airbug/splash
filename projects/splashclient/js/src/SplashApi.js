/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.SplashApi')

//@Require('Class')
//@Require('Obj')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');
    var JQuery  = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    var SplashApi = Class.extend(Obj, {

        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        send: function(endpoint, dataObject, callback) {
            JQuery.ajax({
                url: endpoint,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(dataObject),
                processData: false,
                type: "POST",
                error: function(jqXHR, textStatus, errorThrown) {
                    var error = {
                        jqXHR: jqXHR,
                        textStatus: textStatus,
                        errorThrown: errorThrown
                    };
                    callback(error);
                },
                success: function(data, textStatus, jqXHR) {
                    var result = {
                        data: data,
                        textStatus: textStatus,
                        jqXHR: jqXHR
                    };
                    callback(null, result);
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('splash.SplashApi', SplashApi);
});
