const express = require('express')
const app = express()
const itemRouter = require('./routes/ItemRouter')

const config = require('config')
const PORT = config.get('server.port')

app.use('/items', itemRouter)
// const app = require('./graphql/graphql')

const connection = require('./models/mongo')

app.listen(PORT, () => console.log(`Winter is coming, on port ${PORT}`))
