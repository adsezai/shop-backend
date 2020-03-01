const { Item: ItemModel } = require('../models/schemas')

class ItemService {
  async getItem (itemId) {
    let item = await ItemModel.findById(itemId)
    console.log(item)
    return item
  }
}

module.exports = new ItemService()
