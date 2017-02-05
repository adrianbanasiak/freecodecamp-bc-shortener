var db = require('./db')
var config = require('./config')
var url = require('url')

var findbyurl = function( req, res, url, cb){
  collection = db.collection('links')
  collection.findOne( { original_url: url } , function(err, data ){
    if(data != null){
      var result = {
        original_url: data.original_url,
        short_url: data.short_url
      }
      cb( result )
    }else{
      cb( null )
    }
  })
}

var findbyshortid = function( short_id, cb ){
  collection = db.collection('links')
  collection.findOne( { link_id: short_id }, function(err, data){
    if(data != null){
      cb(data)
    }else{
      cb(null)
    }
  })
}

function isvalidurl( user_url ){
  if( user_url.match( /^http(s)?:\/\//)){
    return true
  }else{
    return false
  }
}

function createlink(req, res, url, cb ){
  collection = db.collection('links')
  collection.insert( { original_url: url }, function(err, data){
    var id = data.insertedIds[0]
    var short_id = String(id).slice(18, 24)
    collection.update( { _id: id }, { $set: {
      link_id: short_id,
      short_url: config.app_url + short_id }}, function(err, data){
      result = {
        original_url: url,
        short_url : config.app_url + short_id
      }
      cb(req, res, result)
    })
  })
}

function prepare(req, res){
  var url = req.params[0]
  if(! isvalidurl( url )){
    returnerror(req, res, 'Invalid URL provided!')      
  }else{
    findbyurl( req, res, url, function( result ){
      if (result){
        sendlink(req, res, result)
      } else {
        createlink( req, res, url, sendlink)
      }
    })
  }     
}

function redirect(req, res){
  var short_id = req.params.short_id
  findbyshortid( short_id, function(result){
    if(result){
      console.log("Redirecting user: ", short_id, result.original_url)
      res.redirect(301, result.original_url)
    }else{
      returnerror(req, res, "This url is not on the database.")
    }
  })

}

function returnerror(req, res, error){
  var result = { error: error }
  res.json(JSON.stringify(result))
}

function sendlink(req, res, data){
  console.log('Responding to client with: ', data)
  res.json( JSON.stringify(data))
  res.end()
}

module.exports = {
  prepare: prepare,
  redirect: redirect
}
