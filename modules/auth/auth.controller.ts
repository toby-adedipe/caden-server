const mongoose = require('mongoose');
import { NextFunction, Request, Response } from "express";
import passport from 'passport';

require('../../models/Users');
require('../../config/passport');

const Users = mongoose.model('Users');

export class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { body: { user } } = req;
      if(!user.email) {
        return res.status(422).json({
          errors: {
            email: 'is required',
          }
        })
      }

      if (!user.password) {
        return res.status(422).json({
          errors: {
            password: 'is required',
          },
        });
      }

      const finalUser = new Users(user);

      finalUser.setPassword(user.password);

      return finalUser.save().then(() => res.json({ user: finalUser.toAuthJSON() }));
    } catch (error) {
      
    }
  }

 async logIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { body: { user } } = req;

    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate('local', { session: false }, (err:any, passportUser:any, info:any) => {
      if (err) {
        return next(err);
      }

      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      }
    })(req, res, next);
  } catch (error) {
    
  }
 }

 async getCurrentUser(req: Request, res: Response, next: NextFunction) {
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
}