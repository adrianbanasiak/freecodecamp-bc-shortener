var mongo = require('mongodb').MongoClient
var config = require('./config')
var db_uri = process.env.MONGODB || config.db_uri
var state = { db: null}

function connect(cb){
  console.log( 'connecting to db: ', db_uri )
  mongo.connect( db_uri , function(err, db){
    state.db = db 
    cb()
  })
}

function connection(){
  return state.db
}

function collection(name){

  return state.db.collection(name)
}


module.exports = {
  connect: connect,
  connection: connection,
  collection: collection
}
