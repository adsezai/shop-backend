const express = require('express')
const app = express()
const itemRouter = require('./routes/ItemRouter')
const userRouter = require('./routes/UserRouter')
const loginRouter = require('./routes/auth')

const config = require('config')
const PORT = config.get('server.port')

app.use(express.json())

app.use('/items', itemRouter)
app.use('/users', userRouter)
app.use('/', loginRouter)

// const app = require('./graphql/graphql')

const connection = require('./models/mongo')

app.listen(PORT, () => console.log(`Winter is coming, on port ${PORT}`))
