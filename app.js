var http = require('http')
var express = require('express')
var app = express()
var config = require('./lib/config')
var db = require('./lib/db')
var link = require('./lib/link')

db.connect(function(){
  console.log(process.env)
  http.createServer( app ).listen( config.port )

  app.get('/new/*', link.prepare)
  app.get('/:short_id', link.redirect)
})
