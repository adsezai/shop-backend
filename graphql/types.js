const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLFloat } = require('graphql')
const userService = require('../service/User')

// TODO add Shop Type with Adress,..
let UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    testNotIncluded: { type: GraphQLString },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    userType: { type: GraphQLString },
    isPremium: { type: GraphQLBoolean },
    language: { type: GraphQLString },
    locale: { type: GraphQLString },
    signupDate: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    numItemsBought: { type: GraphQLInt },
    numItemsSold: { type: GraphQLInt },
    numItemsOnline: { type: GraphQLInt },
    avgRating: { type: GraphQLFloat },
    numRating: { type: GraphQLInt },
    itemsRef: { type: GraphQLList(GraphQLString) },
    avatar: {
      type: AvatarType,
      resolve (parent, args) {
        return parent.avatar
      }
    }
  })
})

let AvatarType = new GraphQLObjectType({
  name: 'Avatar',
  fields: () => ({
    id: { type: GraphQLString },
    size: { type: GraphQLString }
  })
})

let ItemType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    currency: { type: GraphQLString },
    price: { type: GraphQLFloat },
    originalPrice: { type: GraphQLFloat },
    locality: { type: GraphQLString },
    viewedBy: { type: GraphQLList(GraphQLString) },
    createDate: { type: GraphQLString },
    user: {
      type: UserType,
      resolve (parent, args) {
        return userService.getUser(parent.owner)
      }
    }

  })
})

module.exports = {
  UserType,
  ItemType
}
