const express = require('express')
const router = express.Router()
const { authenticateToken, generateAccessToken, generateRefreshToken } = require('../service/Auth')
const validate = require('../lib/validation/validation')

const passport = require('passport')
const initializePassport = require('../passport-config')

initializePassport(passport)

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  // if auth was successfull user is userObj
  const tokenBody = { user: req.user.id, email: req.user.email }
  const accessToken = generateAccessToken(tokenBody)
  const refreshToken = generateRefreshToken(tokenBody)

  res.header('Authorization', `Bearer ${accessToken}`)
  res.json({ refreshToken })
})

router.post('/register', validate('register'), async (req, res, next) => {
  passport.authenticate('register', { session: false }, (error, user, info) => {
    if (error) return next(error) // res.sendStatus(500) // server error
    if (!user) return res.sendStatus(403) // user already exists
    return res.json({ message: 'registered' }) // successfully created
  })(req, res, next)
})

router.post('/secureroute', authenticateToken, (req, res, next) => {
  // if reached here, user is authorized
  res.send('passed')
})

/* router.post('/token', (req, res) => {
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
}) */

module.exports = router
