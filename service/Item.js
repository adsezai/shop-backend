const { Item: ItemModel } = require('../models/schemas')

class ItemService {
  async getItem (itemId) {
    let item = await ItemModel.findById(itemId)
    return item
  }
}

module.exports = new ItemService()
