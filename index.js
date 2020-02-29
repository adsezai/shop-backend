const express = require('express')
const app = express()

const { router } = require('./routes/ItemRouter')
const connection = require('./lib/db/mongo')

const userService = require('./service/User')
const itemService = require('./service/Item')

userService.addNewItem('893faa20-89bf-4c04-b645-2309d30c65cc', { title: 'Golf', currency: 'eur', price: 2800 })

// app.use('/', router)

// app.listen(8080, () => console.log('app running'))
