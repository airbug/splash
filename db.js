// Database
var mongoose = require('mongoose');
var dbName = 'airbug-splash-development';
var dbHost = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var dbPort = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;
var dbOpts = {};
var db = mongoose.createConnection(dbHost, dbName, dbPort, dbOpts); //creates AND opens connection

db
    .on('connecting', function(){
        console.log("Connecting to "  + dbName +  "database at " + dbHost + ":" + dbPort);
    })
    .on('connected', function(){
        console.log("Connected to " + dbName +  "database at " + dbHost + ":" + dbPort);
    })
    .on('open', function(){
        console.log("Connection to " + dbName + " now open");
    })
    .on('error', function(error){
         console.log("Database Connection Error:" + error);
    })
    .on('disconnecting', function(){
        console.log("Disconnecting from "  + dbName +  "database at " + dbHost + ":" + dbPort);
    })
    .on('disconnected', function(){
        console.log("Disconnected from "  + dbName +  "database at " + dbHost + ":" + dbPort);
    })
    .on('close', function(){
        console.log("Connection to " + dbName + " now closed");
    })
    .on('reconnected', function(){
        console.log("Reconnected to " + dbName +  "database at " + dbHost + ":" + dbPort);
    })
    .on('fullsetup', function(){
    
    });

exports.db = db;