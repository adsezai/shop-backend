const { User: UserModel, Item: ItemModel } = require('../models/schemas')
const { userConstraints: userConst, userProperties: userProp } = require('../global/const')
const { errorMaxItemsReached, errorUserHasNotItem } = require('../global/errors')

class UserService {
  async createNewUser (user) {
    let newUser = new UserModel(user)
    return newUser.save()
  }

  async addNewItem (userId, item) {
    let user = await UserModel.findById(userId)
    // check if user can add more items
    user[userProp.PREMIUM] || user[userProp.NUMITEMSONLINE] <= userConst.MAXITEMS || errorMaxItemsReached()

    let newItem = new ItemModel(item)
    const itm = await newItem.save()

    user[userProp.ITEMSREF].push(itm._id)
    await user.save()
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

  async getUser (userId) {
    let user = await UserModel.findById(userId)
    return user
  }
}

module.exports = new UserService()
