const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../service/Auth')
const { errorItemDoesNotExist } = require('../global/errors')
const validate = require('../lib/validation/validation')

const itemService = require('../service/Item')
const userService = require('../service/User')

router.get('/item/:itemId', async (req, res, next) => res.send(await itemService.getItem(null, req.params.itemId)))

router.post('/paginated', async (req, res, next) => {
  const { page, limit } = req.body.searchOptions
  const items = await itemService.getItemsPaginated(page, limit)
  res.send(items)
})

router.post('/item/', authenticateToken, /* validate('itemcreate'), */ async (req, res, next) => {
  // add new item
  try {
    const userId = req.user.user
    const item = req.body
    const newItem = await userService.addNewItem(userId, item)
    return res.json({ item: newItem })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.put('/item/:itemId', authenticateToken, async (req, res, next) => {
  try {
    const itemId = req.params.itemId
    const updateFields = req.body
    const item = await userService.updateItem(req.user.user, itemId, updateFields)
    res.json({ item })
  } catch (error) {
    console.error()
    next(error)
  }
})

router.delete('/item/:itemId', authenticateToken, async (req, res, next) => {
  try {
    const itemId = req.params.itemId
    await userService.deleteItem(req.user.user, itemId)
    return res.json({ id: itemId })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

module.exports = router
