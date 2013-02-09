var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

console.log("Connecting to " + host + ":" + port);

var BetaSignupDBClient = function(host, port) {
  this.db= new Db('airbug-splash-development', new Server(host, port, {auto_reconnect: true}, {w: 1}));
  this.db.open(function(err, db) {
      if(!err) {
          console.log("Connected to 'airbug-splash-development' database");
      }
  });
};

BetaSignupDBClient.prototype.getCollection= function(callback) {
  this.db.collection('betaSignups', function(error, betaSignup_collection) {
    if( error ) callback(error);
    else callback(null, betaSignup_collection);
  });
};

BetaSignupDBClient.prototype.findAll = function(callback) {
    this.getCollection(function(error, betaSignup_collection) {
      if( error ) callback(error)
      else {
        betaSignup_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


BetaSignupDBClient.prototype.findById = function(id, callback) {
    this.getCollection(function(error, betaSignup_collection) {
      if( error ) callback(error)
      else {
        betaSignup_collection.findOne({_id: betaSignup_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

BetaSignupDBClient.prototype.save = function(betaSignup, callback) {
    this.getCollection(function(error, betaSignup_collection) {
      if( error ) callback(error)
      else {
        betaSignup_collection.insert(betaSignups, function() {
          callback(null, betaSignups);
        });
      }
    });
};

exports.BetaSignupDBClient = BetaSignupDBClient;