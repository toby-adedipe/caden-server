const mongoose = require('mongoose');
import { NextFunction, Request, Response } from "express";
import passport from 'passport';
const axios = require("axios");
const bcrypt = require('bcryptjs');

require('../../models/Users');
require('../../config/passport');

const User = require('../../models/Users');

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

export class AuthController {

  async signUp(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const verification_code = generateVerificationCode();
      const newUser = new User({ email, password, verification_code });
      bcrypt.genSalt(10, (err:any, salt:any) => {
        bcrypt.hash(newUser.password, salt, (err:any, hash:any) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then((user:any) => {
              return res.status(200).json({ success: true, message: 'User successfully created', user: user.toAuthJSON() });
            })
            .catch((err:any) => {
              return next(err)
            });
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  async logIn (req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ errors: info })
      }
      if (user && user?.email_is_verified){
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.status(200).json({ success: `logged in ${user.id}`, user: user.toAuthJSON() });
        });
      }else {
        return res.status(500).json({ success: false, error: 'email is not verified yet'})
      }
      
    })(req, res, next);
  }

 async getCurrentUser(req: any, res: Response, next: NextFunction) {
  //todo:
  //fix this type issue
  console.log('request: ',  req)
//   const { id } = req.auth;

//   return Users.findById(id)
//     .then((user:any) => {
//       if(!user) {
//         return res.sendStatus(400);
//       }

//       return res.json({ user: user.toAuthJSON() });
//     });
  }

  async verifyUser(req: Request, res: Response, next: NextFunction){
    User.findOne({
      verification_code: req.query.verification_code,
    })
    .then((user: any) => {
      
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      user.email_is_verified = true;
      user.save((err: any) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        return res.status(200).json({ success: true, message: 'your email has been verified', user: user.toAuthJSON() })
      });
    })
    .catch((e:any) => console.log("error: ", e));
  }
}