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
    this.router.get('/', (req, res) => {
      res.json({ success: true, authRoute: true })
    })
    this.router.post('/signup', this.authController.signUp);
    this.router.post('/login', this.authController.logIn);
    this.router.post('/logout', this.authController.logOut);
    this.router.get('/random', this.authController.random);
    this.router.get('/current',  this.authController.getCurrentUser);
  }
}

export const authRoute = new AuthRoute().router;