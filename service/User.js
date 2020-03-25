const { User: UserModel, Item: ItemModel } = require('../models/schemas')
const { userConstraints: userConst, userProperties: userProp } = require('../global/const')
const { errorMaxItemsReached, errorUserHasNotItem, errorItemDoesNotExist } = require('../global/errors')

class UserService {
  async createNewUser (user) {
    let newUser = new UserModel(user)
    return newUser.save()
  }

  async addNewItem (userId, item) {
    let user = await UserModel.findById(userId)
    // check if user can add more items
    user[userProp.PREMIUM] || user[userProp.NUMITEMSONLINE] <= userConst.MAXITEMS || errorMaxItemsReached()

    item.owner = userId
    let newItem = new ItemModel(item)
    const itm = await newItem.save()

    user[userProp.ITEMSREF].push(itm._id)
    return user.save()
  }

  async deleteItem (userId, itemId) {
    let user = await UserModel.findById(userId)
    let itemPositionInUserRefs = user[userProp.ITEMSREF].indexOf(itemId)

    itemPositionInUserRefs !== -1 || errorUserHasNotItem(user)

    const res = await ItemModel.deleteOne({ _id: itemId })
    console.log('Deleted Item', res)
    res.deletedCount > 0 || errorItemDoesNotExist(itemId)
    user.itemsRef.splice(itemPositionInUserRefs, 1)
    await user.save()
  }

  async updateItem (userId, itemId, updateFields) {
    let user = await UserModel.findById(userId)
    user[userProp.ITEMSREF].includes(itemId) || errorUserHasNotItem(user)

    // return item before update
    let item = await ItemModel.findByIdAndUpdate(itemId, updateFields, { useFindAndModify: false }) || errorItemDoesNotExist(itemId)
    console.log(item)
    return item
  }

  async getItemsByUser (userId) {
    let userItems = ItemModel.find({ owner: userId })
    return userItems
  }

  async getUserByEmail (email) {
    let user = await UserModel.findOne({ email: email })
    return user
  }

  async getUser (userId) {
    let user = await UserModel.findById(userId)
    return user
  }
}

module.exports = new UserService()
