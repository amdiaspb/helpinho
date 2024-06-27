import { User } from "../config/types";
import joi from "joi";

export const createUserSchema = joi.object<CreateUserParams>({
  name: joi.string().required(),
  email: joi.string().email().min(3).max(30).required(),
  password: joi.string().min(6).max(30).required(),
  cpf: joi.string().alphanum().required(),
  number: joi.string().alphanum().required(),
});

export type CreateUserParams = Pick<User, "name" | "email" | "cpf" | "number" | "password">;
