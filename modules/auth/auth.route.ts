import * as express from 'express';
import { AuthController } from './auth.controller';

class AuthRoute {
  router = express.Router();

  authController: AuthController = new AuthController();

  constructor() {
    this.init();
  }

  init() {
    console.log('auth route ts')
    this.router.post('/signup', this.authController.signUp);
    this.router.post('/login', this.authController.logIn);
    this.router.get('/verify', this.authController.verifyUser );
    this.router.get('/isAuth', this.authController.isAuthenticated);
    this.router.post('/forgot-password', this.authController.forgotPassword);
    this.router.post('/reset-password', this.authController.resetPassword);
  }
}

export const authRoute = new AuthRoute().router;