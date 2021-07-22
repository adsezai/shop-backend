const express = require('express')
const router = express.Router()

const { sendJsonNext } = require('../lib/api/util')
const { authenticateToken } = require('../service/Auth')
const userService = require('../service/User')

async function getFavorite (req) {
  const userId = req.user.user

  const items = await userService.getFavoriteItems(userId)

  return { items }
}

async function addFavoriteItem (req) {
  const userId = req.user.user

  const itemId = req.body.id

  await userService.addFavorite(userId, itemId)

  return { id: itemId }
}

async function deleteFavoriteItem (req) {
  const userId = req.user.user

  const itemId = req.body.id

  await userService.deleteFavorite(userId, itemId)

  return { id: itemId }
}

const wrap = fn => (req, res, next) => sendJsonNext(res, next, fn(req))

router.get('/', authenticateToken, wrap(req => getFavorite(req)))
router.post('/', authenticateToken, wrap(req => addFavoriteItem(req)))
router.delete('/', authenticateToken, wrap(req => deleteFavoriteItem(req)))

module.exports = router
