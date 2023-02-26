import * as express from 'express';
import { authRoute } from '../modules/auth/auth.route';
import { writerRoute } from '../modules/writer/writer.route';

export class RouteLoader {
  constructor() {
    console.log('Routes loaded');
    this.init = this.init.bind(this);
  }

  init(app: express.Application) {
    console.log('init  for route loader')
    app.get('/', (req, res) => {
      res.json({ success: true, developmentMode: true })
    })
    app.use('/auth', authRoute);
    app.use('/write', writerRoute)
    
    return app;
  } 
}