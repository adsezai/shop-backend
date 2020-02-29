const { Item } = require('../lib/db/schemas/schemas')

class ItemService {
  async createNewItem (itemObj) {
    let item = new Item(itemObj)
    await item.save()
  }
}

module.exports = new Item()
