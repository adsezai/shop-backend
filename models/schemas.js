const uuid = require('uuid')
const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // always insert longitude
    required: true
  }
})

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
    type: String
    // required: true
  },
  location: { // FIXME String is temporary
    type: pointSchema | String
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
  keywors: [String],
  imageUrls: [String]
})

const user = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String
  },
  password: {
    type: String
  },
  googleId: {
    type: String
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
  picture: {
    url: String
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
  itemsRef: [String],
  favoriteItems: {
    type: [String],
    default: []
  }
})

item.index({ location: '2dsphere' })
// TODO maybe index only on title
item.index({ title: 'text' })

const Item = mongoose.model('Item', item)
const User = mongoose.model('User', user)

Item.on('index', function (error) {
  error && console.log(error)
})

module.exports = {
  Item,
  User
}
