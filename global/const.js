const userProperties = Object.freeze({
  PREMIUM: 'isPremium',
  NUMITEMSONLINE: 'numItemsOnline',
  ITEMSREF: 'itemsRef'
})

const userConstraints = Object.freeze({
  MAXITEMS: 100
})

const itemConstraints = Object.freeze({
  MAXMEDIA: 5
})

module.exports = {
  userProperties,
  userConstraints,
  itemConstraints
}
