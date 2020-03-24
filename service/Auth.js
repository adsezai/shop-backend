const jwt = require('jsonwebtoken')
require('dotenv').config()

const ACCESS_TOKEN_EXIPIRE_TIME = '10m'
const REFRESH_TOKEN_EXIPIRE_TIME = '7d'

function authenticateToken (req, res, next) {
  const authHeader = req.headers['authorization']

  // Token is in header in the form [Bearer, TOKEN]
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = user
    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

function generateAccessToken (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXIPIRE_TIME })
}

function generateRefreshToken (user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXIPIRE_TIME })
}

module.exports = {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken
}
