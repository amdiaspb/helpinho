import { db } from "../config/database";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return unauthorizedResponse(res);

  const token = authHeader.split(" ")[1];
  if (!token) return unauthorizedResponse(res);

  try {
    const session = db.session.find(s => s.token === token);
    if (!session) return unauthorizedResponse(res);
    
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    req.userId = userId;
    next();
  } catch (err) {
    unauthorizedResponse(res);
  }
}

function unauthorizedResponse(res: Response) {
  res.sendStatus(httpStatus.UNAUTHORIZED);
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  userId: string;
};
