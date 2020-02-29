const express = require('express')

let router = express.Router()

function getItemByID (id) {
  return { 'name': 'test' }
}

router.get('/item/:id', (req, res, next) => {
  let item = getItemByID(req.params.id)
  res.send(item)
})

module.exports = { router }
