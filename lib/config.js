var process = require('process')

module.exports = {
  db_uri: "mongodb://localhost:27017/urlshortener",
  port: process.env.PORT || 3000, 
  app_url: process.env.APP_URL || "http://localhost:" + 3000 + "/"
}
