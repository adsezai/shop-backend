require('dotenv').config()
const express = require('express')
const router = express.Router()
const userService = require('../service/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const initializtePassport = require('../passport-config')
initializtePassport(passport)

/* router.post('/login', (req, res) => {
  const username = req.body.username
  const user = { username: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  refreshTokens.push(refreshToken)
  res.json({ accessToken, refreshToken })
}) */

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  // if auth was successfull user is userObj
  res.json({
    message: 'sigup success',
    user: req.user
  })
})

router.post('/register', async (req, res, next) => {
  passport.authenticate('register', { session: false }, (error, user, info) => {
    if (error) return res.sendStatus(500) // server error
    if (!user) return res.sendStatus(403) // user already exists
    return res.json({ message: 'registered' }) // successfully created
  })(req, res, next)
})

let refreshTokens = []

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
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' })
}
function generateRefreshToken (user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
}
function authenticateToken (req, res, next) {
  const authHeader = req.headers['authorization']

  // Token is in header in the form [Bearer, TOKEN]
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log('User', user)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = router
