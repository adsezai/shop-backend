
function throwError (msg) {
  throw new Error(msg)
}

class HTTPError extends Error {
  constructor (code, message) {
    super()
    this.message = message
    this.statusCode = code
  }
}

function throwHTTPError (code, msg) {
  throw new HTTPError(code, msg)
}

const handleError = (err, res) => {
  console.log(err)
  let { statusCode, message } = (err instanceof HTTPError)
    ? err
    : new HTTPError(500, 'Internal Server Error')

  res.status(statusCode).json({ statusCode, message })
}

module.exports = {
  errorMaxItemsReached: () => throwHTTPError(403, `Max count items reached`),
  errorUserHasNotItem: () => throwHTTPError(404, `User has no Item with this ID.`),
  errorItemDoesNotExist: (itemId) => throwHTTPError(404, `Item ${itemId} does not exist`),
  handleErrorMiddleware: handleError
}
