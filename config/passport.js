const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/Users');

const Users = mongoose.model('Users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
})

passport.use(
  new LocalStrategy({ usernameField: "email"}, (email, password, done) => {
    User.findOne( { email: email })
      .then( user => {
        //create new User
        if(!user) {
          const newUser = new User({ email, password });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  return done(null, user);
                })
                .catch(err => {
                  return done(null, false, { message: err });
                });
            });
          });
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