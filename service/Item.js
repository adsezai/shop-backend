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

  async getPaginated (page, limit, filter, coordinates, radius = 100000) {
    // if filter was added show search results else show nearest items
    const search = filter && filter !== ''
      ? getSearchFilter(coordinates, radius, filter)
      : getSearchNoFilter(coordinates)

    const items = await ItemModel.aggregate([
      search,
      { $skip: page || 0 },
      { $limit: limit || 10 },
      { $project: { title: 1, description: 1, price: 1, owner: 1, categories: 1, createDate: 1, originalPrice: 1, viewedBy: 1 } }
    ])
    return items
  }
}

function getSearchFilter (coordinates, radius, filter) {
  return {
    $match: {
      location: {
        $geoWithin: {
          $centerSphere: [coordinates, radius / 6371000] // convert to meters
        }
      },
      $text: { $search: filter }
    }
  }
}

function getSearchNoFilter (coordinates) {
  return {
    $geoNear: {
      near: { type: 'Point', coordinates: coordinates },
      distanceField: 'dist.calculated'
    }
  }
}

const itemService = new ItemService()
module.exports = itemService
