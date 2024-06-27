import { UserData } from "../config/types";
import joi from "joi";

export const authSchema = joi.object<LoginParams>({
  email: joi.string().min(3).max(30).required(),
  password: joi.string().min(6).max(30).required(),
});

export type LoginParams = Pick<UserData, "email" | "password">;
