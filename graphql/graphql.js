const express = require('express')
const app = express()

const graphqlHTTP = require('express-graphql')
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLFloat } = require('graphql')

const userService = require('../service/User')
const itemService = require('../service/Item')

let UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    firstname: { type: GraphQLString },
    numItemsBought: { type: GraphQLInt },
    lastname: { type: GraphQLString },
    language: { type: GraphQLString },
    locale: { type: GraphQLString },
    signupDate: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    userType: { type: GraphQLString },
    isPremium: { type: GraphQLBoolean },
    numItemsSold: { type: GraphQLInt },
    numItemsOnline: { type: GraphQLInt }
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
    createDate: { type: GraphQLString },
    user: {
      type: UserType,
      resolve (parent, args) {
        return userService.getUser(parent.owner)
      }
    }

  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      args: { id: { type: GraphQLID } },
      type: UserType,
      resolve (parent, { id }) {
        return userService.getUser(id)
      }
    },
    item: {
      args: { id: { type: GraphQLID } },
      type: ItemType,
      resolve (parent, { id }) {
        return itemService.getItem(id)
      }
    }
  }
})

let schema = new GraphQLSchema({ query: RootQuery })

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
)

module.exports = app
