const express = require('express')
const app = express()
const { handleErrorMiddleware } = require('./global/errors')
const itemRouter = require('./routes/ItemRouter')
const userRouter = require('./routes/UserRouter')
const loginRouter = require('./routes/signInRouter')
const favoriteRouter = require('./routes/favoriteRouter')

const passport = require('passport')

const config = require('config')
const PORT = config.get('server.port')

app.use(express.json())
app.use(passport.initialize())

app.use('/items', itemRouter)
app.use('/users', userRouter)
app.use('/favorite', favoriteRouter)

app.use('/', loginRouter)

app.use((err, req, res, next) => handleErrorMiddleware(err, res))

// const app = require('./graphql/graphql')

require('./models/mongo')

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
