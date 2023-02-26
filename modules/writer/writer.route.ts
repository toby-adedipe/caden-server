import * as express from 'express';
import { WriterController } from './writer.controller';

class WriterRoute {
  router = express.Router();
  writerController: WriterController = new WriterController();

  constructor() {
    this.init();
  }

  init() {
    console.log('writer protected route ts');

    // add authentication middleware
    this.router.use((req, res, next) => {
      if (!req.user) {
        // user is not authenticated, redirect to login page or return error
        res.status(401).send('Unauthorized');
      } else {
        // user is authenticated, proceed to the next middleware or route handler
        next();
      }
    });

    // add protected routes
    this.router.get('/email', this.writerController.generateEmailResponse);
  }
}

export const writerRoute = new WriterRoute().router;