const express = require('express')
const router = express.Router()
const passport = require('passport')

const { sendJsonNext } = require('../lib/api/util')
const {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken
} = require('../service/Auth')
const validate = require('../lib/validation/validation')
const { getUser } = require('../service/User')
const initializePassport = require('../passport-config')

initializePassport(passport)

async function login (req) {
  const tokenBody = { user: req.user.id, email: req.user.email }
  const accessToken = generateAccessToken(tokenBody)
  const refreshToken = generateRefreshToken(tokenBody)
  // res.header("Authorization", `Bearer ${accessToken}`);
  return { accessToken, refreshToken }
}

async function register (req, res, next) {
  passport.authenticate('register', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.sendStatus(409)

    const tokenBody = { user: user.id, email: user.email }
    const accessToken = generateAccessToken(tokenBody)
    const refreshToken = generateRefreshToken(tokenBody)

    // res.header("Authorization", `Bearer ${accessToken}`);
    return res.json({ accessToken, refreshToken })
  })(req, res, next)
}

async function user (req) {
  const { user: id } = req.user

  const user = await getUser(id)

  const { email, firstname, lastname } = user

  return { email, firstname, lastname }
}

function googleCallback (req, res) {
  const tokenBody = { user: req.user.id, email: req.user.email }
  const accessToken = generateAccessToken(tokenBody)
  // const refreshToken = generateRefreshToken(tokenBody)

  res.json({ accessToken })
}

const wrap = fn => (req, res, next) => sendJsonNext(res, next, fn(req))

router.get('/auth/user', authenticateToken, wrap(req => user(req)))
router.post('/login', passport.authenticate('login', { session: false }), wrap(req => login(req)))
router.post('/register', validate('register'), register)
router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']

  })
)
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }), googleCallback)

module.exports = router
