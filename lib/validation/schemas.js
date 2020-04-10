const schemaNames = Object.freeze({
  register: 'register',
  itemcreate: 'itemcreate'
})

const schemas = {
  [schemaNames.register]: {
    title: 'Register',
    description: '',
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email'

      },
      password: {
        type: 'string'
      },
      name: {
        type: 'string'
      }
    },
    required: ['email', 'password', 'name']
  },
  [schemaNames.itemcreate]: {

  }
}

module.exports = schemas
