const mongoose = require('mongoose')

const item = new mongoose.Schema({
  name: {
    type: String
  }
})

const Item = mongoose.model('Item', item)
module.exports = {
  Item
}
