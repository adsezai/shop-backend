const { User: UserModel, Item: ItemModel } = require('../models/schemas')
const { userConstraints: userConst, userProperties: userProp } = require('../global/const')
const { errorMaxItemsReached, errorUserHasNotItem, errorItemDoesNotExist } = require('../global/errors')

class UserService {
  async createNewUser (user) {
    const newUser = new UserModel(user)
    return newUser.save()
  }

  async addNewItem (userId, item) {
    const user = await UserModel.findById(userId)
    // check if user can add more items
    user[userProp.PREMIUM] || user[userProp.NUMITEMSONLINE] < userConst.MAXITEMS || errorMaxItemsReached()

    item.owner = userId
    const newItem = new ItemModel(item)
    const itm = await newItem.save()

    user[userProp.ITEMSREF].push(itm._id)
    user[userProp.NUMITEMSONLINE]++
    await user.save()
    return itm
  }

  async deleteItem (userId, itemId) {
    const user = await UserModel.findById(userId)
    const itemPositionInUserRefs = user[userProp.ITEMSREF].indexOf(itemId)

    itemPositionInUserRefs !== -1 || errorUserHasNotItem(user)

    const res = await ItemModel.deleteOne({ _id: itemId })
    console.log('Deleted Item', res)
    res.deletedCount > 0 || errorItemDoesNotExist(itemId)
    user.itemsRef.splice(itemPositionInUserRefs, 1)
    user[userProp.NUMITEMSONLINE]--
    await user.save()
  }

  async updateItem (userId, itemId, updateFields) {
    const user = await UserModel.findById(userId)
    user[userProp.ITEMSREF].includes(itemId) || errorUserHasNotItem(user)

    const item = await ItemModel.findByIdAndUpdate(itemId, updateFields, { useFindAndModify: false, new: true }) || errorItemDoesNotExist(itemId)
    return item
  }

  async getItemsByUser (userId) {
    const userItems = ItemModel.find({ owner: userId }, null, { sort: { createDate: 'desc' } })
    return userItems
  }

  async getUserByEmail (email) {
    const user = await UserModel.findOne({ email: email })
    return user
  }

  async findUser (options) {
    const user = await UserModel.findOne(options)
    return user
  }

  async getUser (userId) {
    const user = await UserModel.findById(userId)
    return user
  }

  // TODO what if some items have been deleted?
  async getFavoriteItems (userId) {
    const user = await UserModel.findById(userId)
    const itemIds = user.favoriteItems

    const items = await ItemModel.find().where('_id').in(itemIds).exec()

    if (user.favoriteItems.length !== items.length) {
      user.favoriteItems = items.map(i => i._id)
      await user.save()
    }

    return items
  }

  async addFavorite (userId, itemId) {
    await ItemModel.findById(itemId) || errorItemDoesNotExist(itemId)
    return UserModel.findByIdAndUpdate(userId, { $addToSet: { favoriteItems: itemId } }, { useFindAndModify: false })
  }

  async deleteFavorite (userId, itemId) {
    // FIXME what if item is deleted but still in favoritelist
    // await ItemModel.findById(itemId) || errorItemDoesNotExist(itemId)
    return UserModel.findByIdAndUpdate(userId, { $pullAll: { favoriteItems: [itemId] } }, { useFindAndModify: false })
  }
}

module.exports = new UserService()
