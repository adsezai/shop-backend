const { Item: ItemModel } = require('../models/schemas')

class ItemService {
  async getItem (userId, itemId) {
    let item = await ItemModel.findById(itemId)
    if (userId && item.viewedBy.includes(userId)) await this.updateItemViewedBy(item, userId)
    return item
  }

  async updateItemViewedBy (item, userId) {
    item.viewedBy.push(userId)
    return item.save()
  }

  async getItemsPaginated (page, limit, sort, filter) {
    let items = await ItemModel.find({}, 'title description price currency location', { skip: 0, limit: 20 })
    return items
  }
}

const itemService = new ItemService()
module.exports = itemService
