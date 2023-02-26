const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/Users');

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
})

passport.use(
  new LocalStrategy({ 
    usernameField: "email"
  }, (email, password, done) => {
    User.findOne( { email: email })
      .then( user => {
        //create new User
        if(!user) {
          return done(null, false, { message: "this email isn't registered" });
        } else {
          //Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Wrong password" });
            }
          });
        }
      })
      .catch(err => {
        return done(null, false, { message: err});
      })
  })
);

module.exports = passport;
