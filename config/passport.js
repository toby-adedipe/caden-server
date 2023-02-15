const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/Users');

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
})

function generateVerificationCode() {
  const length = Math.floor(Math.random() * 11) + 40; // Generate a length between 10 and 20
  let code = '';
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Define the character set
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charset.length); // Choose a random character from the set
    code += charset.charAt(index);
  }
  return code;
}

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

// passport.use( new LocalStrategy({
//   usernameField: 'user[email]',
//   passwordField: 'user[password]',
// }, (email, password, done) => {
//   Users.findOne({ email })
//     .then((user) => {
//       if(!user || !user.validatePassword(password)) {
//         return done(null, false, { errors: { 'email or password': 'is invalid' }});
//       }

//       return done(null, user);
//     })
//     .catch(done);
// }))