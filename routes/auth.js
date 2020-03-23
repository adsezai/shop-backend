require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')

const ACCESS_TOKEN_EXIPIRE_TIME = '10m'
const REFRESH_TOKEN_EXIPIRE_TIME = '7d'

const initializtePassport = require('../passport-config')
initializtePassport(passport)

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  // if auth was successfull user is userObj
  const tokenBody = { user: req.user.id, email: req.user.email }
  const accessToken = generateAccessToken(tokenBody)

  res.header('Authorization', `Bearer ${accessToken}`)
  res.json({ accessToken })
})

router.post('/register', async (req, res, next) => {
  passport.authenticate('register', { session: false }, (error, user, info) => {
    if (error) return res.sendStatus(500) // server error
    if (!user) return res.sendStatus(403) // user already exists
    return res.json({ message: 'registered' }) // successfully created
  })(req, res, next)
})

router.post('/secureroute', authenticateToken, (req, res, next) => {
  // if reached here, user is authorized
  res.send('passed')
})

router.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (!refreshToken) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken })
  })
})

router.delete('/delete', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

function generateAccessToken (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXIPIRE_TIME })
}
function generateRefreshToken (user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: TOKEN_EXIPIRE_TIME })
}

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

module.exports = router
