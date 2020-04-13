const { Item: ItemModel } = require('../models/schemas')

class ItemService {
  async getItem (userId, itemId) {
    const item = await ItemModel.findById(itemId)
    if (userId && item.viewedBy.includes(userId)) await this.updateItemViewedBy(item, userId)
    return item
  }

  async getItemOwner (itemId) {
    return ItemModel.findById(itemId, 'owner')
  }

  async deleteItem (itemId) {
    return ItemModel.findByIdAndDelete(itemId)
  }

  async updateItemViewedBy (item, userId) {
    item.viewedBy.push(userId)
    return item.save()
  }

  async getItemsPaginated (page, limit, filter, coordinates) { // coordinates must be first longitude in arr
    // const items = await ItemModel.find({}, 'title description price currency location', { skip: page || 0, limit: limit || 10 })
    const items = await ItemModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [10.077955, 48.162323] },
          distanceField: 'dist.calculated',
          query: { $or: [{ description: { $regex: filter, $options: 'i' } }, { title: { $regex: filter, $options: 'i' } }] }
        }
      },
      { $skip: page || 0 },
      { $limit: limit || 10 }
    ])
    return items
  }
}

const itemService = new ItemService()
module.exports = itemService
