const express = require('express')
const router = express.Router()

const itemService = require('../service/Item')

router.get('/item/:itemId', async (req, res, next) => res.send(await itemService.getItem(null, req.params.itemId)))

router.post('/paginated', async (req, res, next) => res.send(await itemService.getItemsPaginated()))

module.exports = router
