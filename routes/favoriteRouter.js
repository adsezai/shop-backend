const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../service/Auth')
const userService = require('../service/User')

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.user
    const items = await userService.getFavoriteItems(userId)
    res.json({ items })
  } catch (error) {
    next(error)
  }
})

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.user
    const itemId = req.body.id
    await userService.addFavorite(userId, itemId)
    res.json({ id: itemId })
  } catch (error) {
    next(error)
  }
})

router.delete('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.user
    const itemId = req.body.id
    await userService.deleteFavorite(userId, itemId)
    res.json({ id: itemId })
  } catch (error) {
    next(error)
  }
})

module.exports = router
