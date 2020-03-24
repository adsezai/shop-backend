const { User: UserModel, Item: ItemModel } = require('../models/schemas')
const { userConstraints: userConst, userProperties: userProp } = require('../global/const')
const { errorMaxItemsReached, errorUserHasNotItem } = require('../global/errors')

class UserService {
  async createNewUser (user) {
    let newUser = new UserModel(user)
    return newUser.save()
  }

  async addNewItem (userId, item) {
    console.log('user')
    let user = await UserModel.findById(userId)
    console.log(user)
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

    ItemModel.deleteOne({ _id: itemId })

    user.itemRefs.splice(itemPositionInUserRefs, 1)
    await user.save()
  }
  async updateItem () {

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
