const express = require('express')
const app = express()
const { handleErrorMiddleware } = require('./global/errors')
const itemRouter = require('./routes/ItemRouter')
const userRouter = require('./routes/UserRouter')
const loginRouter = require('./routes/signInRouter')
const favoriteRouter = require('./routes/favoriteRouter')

const config = require('config')

const passport = require('passport')
const PORT = config.get('server.port')

require('./models/mongo')
require('./service/ImageStorage').initializeImageStorage(config.get('azure.connectionString'), config.get('azure.containerName'))

app.use(express.json())
app.use(passport.initialize())

app.use('/items', itemRouter)
app.use('/users', userRouter)
app.use('/favorite', favoriteRouter)

app.use('/', loginRouter)

app.use((err, req, res, next) => handleErrorMiddleware(err, res))

// const app = require('./graphql/graphql')

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
