const { User: UserModel, Item: ItemModel } = require('../models/schemas')
const { userConstraints: userConst, userProperties: userProp } = require('../global/const')
const { errorMaxItemsReached, errorUserHasNotItem } = require('../global/errors')

class UserService {
  async addNewItem (userId, item) {
    let user = await UserModel.findById(userId)
    user[userProp.PREMIUM] || user[userProp.NUMITEMSONLINE] <= userConst.MAXITEMS || errorMaxItemsReached()

    let newItem = new ItemModel(item)
    const itm = await newItem.save()

    user[userProp.ITEMSREF].push(itm._id)
    await user.save()
  }

  async deleteItem (userId, itemId) {
    let user = await UserModel.findById(userId)

    user[userProp.ITEMSREF].includes(itemId) || errorUserHasNotItem(user)

    ItemModel.deleteOne({ _id: itemId })
    // TODO Remove item from user itemRef
  }
  async updateItem () {

  }

  async getUser (userId) {
    let user = await UserModel.findById(userId)
    return user
  }
}

module.exports = new UserService()
