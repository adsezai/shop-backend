const express = require('express')
const router = express.Router()

const itemService = require('../service/Item')
const userService = require('../service/User')

router.get('/item/:itemId', async (req, res, next) => res.send(await itemService.getItem(null, req.params.itemId)))

router.post('/paginated', async (req, res, next) => {
  const { page, limit } = req.body.searchOptions
  const items = await itemService.getItemsPaginated(page, limit)
  res.send(items)
})

router.post('item', async (req, res, next) => {
  // add new item
  userService.addNewItem()
})

module.exports = router
