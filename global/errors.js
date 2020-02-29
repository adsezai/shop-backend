
function throwError (msg) {
  throw new Error(msg)
}

module.exports = {
  errorMaxItemsReached: () => throwError(`Error: This user reached max count Items`),
  errorUserHasNotItem: () => throwError(`Error: This user is not owner of the Item`)
}
