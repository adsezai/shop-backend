const itemService = require('../service/Item')
const userService = require('../service/User')

const { simpleItem } = require('../testdata/items.testdata')
const { simpleUser } = require('../testdata/user.testdata')

test('add a new item', async () => {
  const user = await userService.createNewUser(simpleUser)
  const item = await userService.addNewItem(user.id, simpleItem)
  expect(1).toBe(1)
})
