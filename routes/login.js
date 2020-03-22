const express = require('express')
const router = express.Router()

require('dotenv').config()

const jwt = require('jsonwebtoken')

const posts = [
  {
    'username': 'Adis',
    'text': 'hallo'
  },
  {
    'username': 'Mustermann',
    'text': 'cao'
  }
]

router.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user.username)
  res.json(posts.filter(post => post.username === req.user.username))
})

router.post('/', (req, res) => {
  const username = req.body.username
  const user = { username: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  refreshTokens.push(refreshToken)
  res.json({ accessToken, refreshToken })
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
