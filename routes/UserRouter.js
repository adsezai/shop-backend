const express = require('express')
const router = express.Router()

const userService = require('../service/User')

router.get('/user/:userId', async (req, res, next) => res.send(await userService.getUser(req.params.userId)))

router.get('/user/:userId/items', async (req, res, next) => {
  const itemsOfUser = await userService.getItemsByUser(req.params.userId)
  res.send(itemsOfUser)
})

module.exports = router
