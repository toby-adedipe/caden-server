const mongoose = require('mongoose');
import { NextFunction, Request, Response } from "express";
import passport from 'passport';
import { PrismaClient } from '@prisma/client'

require('../../models/Users');
require('../../config/passport');

const Users = mongoose.model('Users');

const prisma = new PrismaClient();


export class AuthController {

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      const { email,  password } = req.body;

      const  user = {email, password};

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

      finalUser.setPassword(user?.password);

      return finalUser.save().then(() => res.json({ user: finalUser.toAuthJSON() }));
    } catch (error) {
      return next(error);
    }
  }

  async random(req: any, res: any, next: any) {
    try {
      const allUsers = await prisma.user.findMany()

      return res.json({success: true, allUsers })
  
    } catch (error) {
      return next(error);
    }
    // await prisma.user.create({
    //   data: {
    //     firstName: 'Rich',
    //     lastName: 'Man',
    //     email: 'hello@prisma.com',
    //     status: 'regular',
    //     requests: {
    //       create: {
    //         prompt: 'My first post',
    //       },
    //     },
    //   },
    // })
  
  }

  // async logIn(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { email,  password } = req.body;

  //     const  user = {email, password};

  //     if(!user.email) {
  //       return res.status(422).json({
  //         errors: {
  //           email: 'is required',
  //         },
  //       });
  //     }

  //     if(!user.password) {
  //       return res.status(422).json({
  //         errors: {
  //           password: 'is required',
  //         },
  //       });
  //     }
      
  //     return passport.authenticate('local', { session: false }, (err:any, passportUser:any, info:any) => {
  //       if (err) {
  //         return next(err);
  //       }

  //       console.log('passportuser: ', passportUser);

  //       if(passportUser) {
  //         const user = passportUser;
  //         user.token = passportUser.generateJWT();

  //         return res.json({ user: user.toAuthJSON() });
  //       }else{
  //         return res.json({ message: 'user not found' });
  //       }

  //     })(req, res, next);
  //   } catch (error) {
  //     return next(error);
  //   }
  // }

  async logIn (req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ errors: "No user found" })
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ success: `logged in ${user.id}`});
      });
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

  async logOut(req: any, res: Response, next: NextFunction) {
    
  }
}