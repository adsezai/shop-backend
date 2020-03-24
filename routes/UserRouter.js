const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../service/Auth')

const userService = require('../service/User')

router.get('/user/:userId', async (req, res, next) => res.send(await userService.getUser(req.params.userId)))

router.get('/user/:userId/items', async (req, res, next) => {
  const user = await userService.getItemsByUser(req.params.userId)
  console.log(user)
  res.send(user)
})

module.exports = router
