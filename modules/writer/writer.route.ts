import * as express from 'express';
import { WriterController } from './writer.controller';
import passport, { session } from 'passport';

class WriterRoute {
  router = express.Router();
  writerController: WriterController = new WriterController();

  constructor() {
    this.init();
  }

  init() {
    console.log('writer protected route ts');

    // add authentication middleware
    this.router.use(passport.authenticate('jwt', { session:false }));

    // add protected routes
    this.router.post('/email', this.writerController.generateEmailResponse);
  }
}

export const writerRoute = new WriterRoute().router;