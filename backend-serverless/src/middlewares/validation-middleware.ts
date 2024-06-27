import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import httpStatus from "http-status";

export function validateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, "body");
}

export function validateParams<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, "params");
}

function validate(schema: ObjectSchema, type: "body" | "params") {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[type], {
      abortEarly: false,
    });

    if (error) {
      const err = error.details.map(d => d.message);
      res.status(httpStatus.BAD_REQUEST).send(err);
    } else {
      next();
    }
  };
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;
