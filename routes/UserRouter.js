const express = require('express')
const router = express.Router()

const itemService = require('../service/Item')
const userService = require('../service/User')

router.get('/user/:userId', async (req, res, next) => res.send(await userService.getUser(req.params.userId)))

router.get('user/:userId/items', async (req, res, next) => {
  userService.getItemsByUser(this.params.userId)
})

module.exports = router
