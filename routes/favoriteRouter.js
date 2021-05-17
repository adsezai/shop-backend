const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../service/Auth')
const userService = require('../service/User')

async function getFavorite (req, res, next) {
  try {
    const userId = req.user.user
    const items = await userService.getFavoriteItems(userId)
    res.json({ items })
  } catch (error) {
    next(error)
  }
}

async function addFavoriteItem (req, res, next) {
  try {
    const userId = req.user.user
    const itemId = req.body.id
    await userService.addFavorite(userId, itemId)
    res.json({ id: itemId })
  } catch (error) {
    next(error)
  }
}

async function deleteFavoriteItem (req, res, next) {
  try {
    const userId = req.user.user
    const itemId = req.body.id
    await userService.deleteFavorite(userId, itemId)
    res.json({ id: itemId })
  } catch (error) {
    next(error)
  }
}

router.get('/', authenticateToken, getFavorite)
router.post('/', authenticateToken, addFavoriteItem)
router.delete('/', authenticateToken, deleteFavoriteItem)

module.exports = router
