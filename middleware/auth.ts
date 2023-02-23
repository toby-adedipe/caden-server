import { NextFunction, Request, Response } from "express";

export class AuthMiddleWare {

  isAuthenticated(req:Request, res:Response, next:NextFunction) {
    if (req.isAuthenticated()) {
      return next()
    }
    return false
  }
}

