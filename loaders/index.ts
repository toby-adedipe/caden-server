import * as express from 'express';
import { RouteLoader } from './route.loader';

export class Loaders {
  public static async init(app: express.Application, api:any) {
    await new RouteLoader().init(app);
  }
}