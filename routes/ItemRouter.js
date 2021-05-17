const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../service/Auth')
// const { errorItemDoesNotExist } = require('../global/errors')
const validate = require('../lib/validation/validation')
const itemService = require('../service/Item')
const userService = require('../service/User')

async function getItem (req, res, next) {
  const item = await itemService.getItem(null, req.params.itemId)
  res.send(item)
}

async function searchItems (req, res, next) {
  const { page, limit, filter, coordinates, radius } = req.body.searchOptions
  const items = await itemService.getPaginated(
    page,
    limit,
    filter,
    coordinates,
    radius
  )
  res.send(items)
}

async function addItem (req, res, next) {
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
}

async function updateItem (req, res, next) {
  try {
    const itemId = req.params.itemId
    const updateFields = req.body
    const item = await userService.updateItem(
      req.user.user,
      itemId,
      updateFields
    )
    res.json({ item })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

async function deleteItem (req, res, next) {
  try {
    const itemId = req.params.itemId
    await userService.deleteItem(req.user.user, itemId)
    return res.json({ id: itemId })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

router.get('/item/:itemId', getItem)
router.post('/item/', authenticateToken, validate('itemcreate'), addItem)
router.post('/paginated', searchItems)
router.put('/item/:itemId', authenticateToken, updateItem)
router.delete('/item/:itemId', authenticateToken, deleteItem)

module.exports = router
