const LocalStrategy = require('passport-local').Strategy
const userService = require('./service/User')
const bcrypt = require('bcrypt')

async function authenticateUser (email, password, done) {
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

function initialize (passport) {
  return passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
}

module.exports = initialize
