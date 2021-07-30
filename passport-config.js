const LocalStrategy = require('passport-local').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const bcrypt = require('bcrypt')

const userService = require('./service/User')

async function loginHander (email, password, done) {
  try {
    const user = await userService.getUserByEmail(email)
    if (user == null) return done(null, false, { message: 'No user found' })
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

async function googleHandler (token, tokenSecret, profile, done) {
  try {
    const user = await userService.findUser({ googleId: profile.id })
    if (user) done(null, user)
    else {
      // create user // TODO get email correct
      const userEmail = profile.emails ? profile.emails[0].value : ''
      const newUser = await userService.createNewUser({ googleId: profile.id, firstname: profile.displayName, email: userEmail })
      done(null, newUser)
    }
  } catch (error) {
    done(error)
  }
}

function initializePassport (passport) {
  passport.use('register', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, registerHandler))

  passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, loginHander))

  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.APPLICATION_ROOT}/api/auth/google/callback`
  }, googleHandler))
}

module.exports = initializePassport
