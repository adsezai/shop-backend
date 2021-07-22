async function sendJsonNext (res, next, func) {
  return func.then(result => res.json(result)).catch(next)
}

module.exports = {
  sendJsonNext
}
