const {
  itemProperties: p,
  userConstraints: userConst } = require('../../global/const')

class ItemRuleHandler {
  constructor () {

  }

  canAddItem (dbObj) {
    return (dbObj[p.PREMIUM] || dbObj[p.NUMITEMSONLINE] <= userConst.MAXITEMS)
  }
}

module.exports = new ItemRuleHandler()
