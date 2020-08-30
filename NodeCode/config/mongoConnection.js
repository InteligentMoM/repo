const MongoClient = require( 'mongodb' ).MongoClient;
const url = require("../config/config.json").MONGODB_URI;
const database = require("../config/config.json").DATABASE;

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true }, function( err, client ) {
      _db  = client.db(database);
      return callback( err );
    } );
  },

  getDatabase   : function() {
    return _db;
  }
};