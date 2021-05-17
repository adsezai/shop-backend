const express = require('express')
const router = express.Router()

const userService = require('../service/User')

async function getUser (req, res, next) {
  const user = await userService.getUser(req.params.userId)
  res.send(user)
}

async function getUserItems (req, res, next) {
  const itemsOfUser = await userService.getItemsByUser(req.params.userId)
  res.send(itemsOfUser)
}

router.get('/user/:userId', getUser)
router.get('/user/:userId/items', getUserItems)

module.exports = router
