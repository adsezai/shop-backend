const uuid = require('uuid')
const mongoose = require('mongoose')

const item = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  title: {
    type: String,
    required: true
  },
  owner: String,
  description: String,
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    default: function () { return this.price }
  },
  locality: String,
  currency: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  updateDate: {
    type: Date
  },
  viewedBy: [String],
  distance: Number,
  buyer: String,
  numLikes: 0,
  isNewItem: Boolean,
  isSold: Boolean,
  isFree: Boolean,
  isOnSale: Boolean,
  isLiked: Boolean,
  isWatched: Boolean,
  isBoosted: Boolean,
  isShippable: Boolean,
  categories: [String],
  allowedActivities: {
    canAskQuestions: Boolean,
    canDelistItem: Boolean,
    canMarkAsSoldElsewhere: Boolean,
    canEdit: Boolean,
    canAddItemToWatchList: Boolean,
    canDialNumber: Boolean,
    canReportItem: Boolean,
    canBuyNow: Boolean
  },
  contQuestions: Number,
  countAnswers: Number,
  keywors: [String]

})

const user = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: String,
  avatar: {
    id: String,
    size: String
  },
  language: String,
  locale: String,
  signupDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  userType: {
    type: String,
    default: 'private'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  numItemsSold: {
    type: Number,
    default: 0
  },
  numItemsBought: {
    type: Number,
    default: 0
  },
  numItemsOnline: {
    type: Number,
    default: 0
  },
  itemsRef: [String]
})

const Item = mongoose.model('Item', item)
const User = mongoose.model('User', user)

module.exports = {
  Item,
  User
}
