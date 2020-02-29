const express = require('express')
const app = express()

const { router } = require('./routes/ItemRouter')
// const connection = require('./lib/db/mongo')
// const { Item } = require('./lib/db/schemas/schemas')

/* const itm = new Item({ name: 'Golf' })
itm.save().then(() => console.log('saved')) */
app.use('/', router)

app.listen(8080, () => console.log('app running'))
