//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('SplashApi')

//@Require('Class')
//@Require('Obj')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Obj =       bugpack.require('Obj');
var JQuery =    bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SplashApi = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Class Methods
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
