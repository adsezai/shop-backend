const LocalStrategy = require('passport-local').Strategy
const userService = require('./service/User')
const bcrypt = require('bcrypt')

async function loginHander (email, password, done) {
  const user = await userService.getUserByEmail(email)
  if (user == null) return done(null, false, { message: 'No user found' })

  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user)
    } else {
      done(null, false, { message: 'Wrong email or password' })
    }
  } catch (error) {
    done(error)
  }
}
async function registerHandler (req, email, password, done) {
  const existingUser = await userService.getUserByEmail(email)
  if (existingUser != null) return done(null, false, { message: 'User with email already exists' })

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userService.createNewUser({ firstname: req.body.firstname, email: email, password: hashedPassword })
    return done(null, user)
  } catch (error) {
    done(error)
  }
}

function initialize (passport) {
  passport.use('register', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, registerHandler))
  passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, loginHander))
}

module.exports = initialize
