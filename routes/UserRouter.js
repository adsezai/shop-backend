const express = require('express')
const router = express.Router()

const userService = require('../service/User')
const { sendJsonNext } = require('../lib/api/util')

async function getUser (req) {
  const user = await userService.getUser(req.params.userId)

  return user
}

async function getUserItems (req) {
  const itemsOfUser = await userService.getItemsByUser(req.params.userId)

  return itemsOfUser
}

const wrap = fn => (req, res, next) => sendJsonNext(res, next, fn(req))

router.get('/user/:userId', wrap(req => getUser(req)))
router.get('/user/:userId/items', wrap(req => getUserItems(req)))

module.exports = router
