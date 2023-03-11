const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const User = require('../models/Users');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem')
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
}

const strategy = new JwtStrategy(options, (payload, done) => {
  
  User.findOne({ _id: payload.sub })
    .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
    })
    .catch(err => done(err, null))
});

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   })
// })

passport.use(strategy);

module.exports = passport;
