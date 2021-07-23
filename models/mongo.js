const config = require('config')
const mongoose = require('mongoose')

const MONGO_URI = config.get('db.uri')
const POOLSIZE = config.get('db.poolsize')

const connection = mongoose.connect(MONGO_URI, { useNewUrlParser: true, poolSize: POOLSIZE, useUnifiedTopology: true })
  .then(console.log(`Connected to MongoDb ${MONGO_URI} with Poolsize ${POOLSIZE}`))
  .catch(error => console.log(`Could not connect to MongoDB ${MONGO_URI}: ${error}`))

module.exports = connection
