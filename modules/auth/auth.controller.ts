import { NextFunction, Request, Response } from "express";
import passport from 'passport';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('../../services/emailService');

require('../../models/Users');
require('../../config/passport');

const User = require('../../models/Users');

export class AuthController {

  // signUp() method creates a new user
  async signUp(req: Request, res: Response, next: NextFunction) {
    const { email, password, firstName, lastName } = req.body;
    try {
      // Generate verification code for the user
      const verification_code = crypto.randomBytes(20).toString('hex');     
    
      // Create a new user object with the email, password and verification code
      const newUser = new User({ email, password, verification_code, first_name: firstName, last_name: lastName });
    
      // Hash the password
      bcrypt.genSalt(10, (err:any, salt:any) => {
        bcrypt.hash(newUser.password, salt, (err:any, hash:any) => {
          if (err) throw err;
          newUser.password = hash;
    
          // Save the new user to the database
          newUser.save()
            .then((user:any) => {
              return res.status(200).json({ success: true, message: 'User successfully created', user: user.toAuthJSON() });
            })
            .catch((err:any) => {
              return next(err)
            });
        });
      });
        //send email verification email.
        emailService.sendConfirmationEmail(firstName, email, verification_code)
    } catch (error) {
        return next(error);
    }
  }

  // logIn() method logs in a user
  async logIn (req: Request, res: Response, next: NextFunction) {
    // Authenticate the user with the passport local strategy
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ errors: info })
      }
      if (user && user?.email_is_verified){
        // If user is authenticated and email is verified, log in the user
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.status(200).json({ success: `logged in ${user.id}`, user: user.toAuthJSON() });
        });
      }else {
        // If email is not verified, send error message
        return res.status(500).json({ success: false, error: 'email is not verified yet'})
      }
      
    })(req, res, next);
  }

  async verifyUser(req: Request, res: Response, next: NextFunction){
    const verification_code = req.query.verification_code;

    // Find the user with the given verification code
    User.findOne({
      verification_code: verification_code,
    })
    .then((user: any) => {

      if (!user) {
        // If user is not found, send error message
        return res.status(404).send({ message: "User not found" });
      }

      // Set the email_is_verified property to true and save the user
      user.email_is_verified = true;
      user.save((err: any) => {
        if (err) {
          return next(err)
        }
        return res.status(200).json({ success: true, message: 'your email has been verified', user: user.toAuthJSON() })
      });
    })
    .catch((err:any) => {
      return next(err)
    });
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction){
    const userEmail = req.body.email;

    // Generate password reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Store token in database
    User.findOne({
      email: userEmail,
    })
    .then((user: any) => {
      if(user){
        user.reset_token = token;
        user.save((err: any) => {
          if (err) {
            return next(err)
          }
        });
      }
    })
    .catch((err:any) => {
      return next(err)
    });
    
    // Send password reset email to user
    emailService.sendPasswordResetEmail(userEmail);

    res.status(200).json({success: true, message: 'Password reset instructions sent to your email.'});
  }

  async resetPassword(req: Request, res: Response, next: NextFunction){
    const reset_token = req.query.reset_token;
    const newPassword = req.body.newPassword;

    // Verify token and get user email
    User.findOne({
      reset_token: reset_token,
    })
    .then((user: any) => {
      if (!user) {
        return res.status(400).send('Invalid or expired password reset token.');
      }
      console.log('user: ', user.email);
      if(user){
        // Update user's password in database
        bcrypt.genSalt(10, (err:any, salt:any) => {
          bcrypt.hash(newPassword, salt, (err:any, hash:any) => {
            if (err) throw err;
            user.password = hash;
      
            // Save the new user to the database
            user.save()
              .then((user:any) => {
                return res.status(200).json({ success: true, message: 'Your password was changed successfully', user: user.toAuthJSON() });
              })
              .catch((err:any) => {
                return next(err)
              });
          });
        });
      }
      
    })
    .catch((err:any) => {
      return next(err)
    });
  }

  async isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return res.json({success: true, authenticated: true})
    } else {
      return res.json({success: true, authenticated: false})
    }
  }
}