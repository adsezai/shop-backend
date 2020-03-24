const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../service/Auth')
const { errorItemDoesNotExist } = require('../global/errors')

const itemService = require('../service/Item')
const userService = require('../service/User')

router.get('/item/:itemId', async (req, res, next) => res.send(await itemService.getItem(null, req.params.itemId)))

router.post('/paginated', async (req, res, next) => {
  const { page, limit } = req.body.searchOptions
  const items = await itemService.getItemsPaginated(page, limit)
  res.send(items)
})

router.post('/item/', authenticateToken, async (req, res, next) => {
  console.log('post iten')
  // add new item
  try {
    const userId = req.user.user
    const item = req.body
    await userService.addNewItem(userId, item)
    return res.json({ 'ok': 'ok' })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.delete('/item/:itemId', authenticateToken, async (req, res, next) => {
  const itemId = req.params.itemId
  // get owner of item
  try {
    const owner = await itemService.getItemOwner(itemId)
    owner || errorItemDoesNotExist(itemId)
    // check if owner and user.id is same
    if (owner === req.user.id) return res.sendStatus(403)
    // delete item
    await itemService.deleteItem(itemId)
    return res.json({ id: itemId })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

module.exports = router
