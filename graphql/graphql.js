const express = require('express')
const app = express()
const graphqlHTTP = require('express-graphql')
const { GraphQLObjectType, GraphQLSchema, GraphQLID } = require('graphql')
const { ItemType, UserType } = require('./types')
const userService = require('../service/User')
const itemService = require('../service/Item')

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
      // TODO remove userid later
      args: { id: { type: GraphQLID }, userid: { type: GraphQLID } },
      type: ItemType,
      resolve (parent, { id, userid }) {
        return itemService.getItem(userid, id)
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
