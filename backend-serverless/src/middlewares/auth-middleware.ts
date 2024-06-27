import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import { sessionRepository } from "../repositories/session-repository";

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return unauthorizedResponse(res);

  const token = authHeader.split(" ")[1];
  if (!token) return unauthorizedResponse(res);

  try {
    const jwtToken = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    const userPK = jwtToken?.userId;
    const session = await sessionRepository.getByUserPK(userPK);

    //if (!session) return unauthorizedResponse(res);
    if (!session) return res.json({ token, jwtToken, userPK, session });
    
    req.userId = userPK;
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
