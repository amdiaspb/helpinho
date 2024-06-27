import { Help } from "../config/types";
import joi from "joi";

export const createHelpSchema = joi.object<CreateHelpParams>({
  image: joi.string().required(),
  title: joi.string().required(),
  description: joi.string().required(),
  tag: joi.string().required(),
  totalValue: joi.number().required(),
});

export type CreateHelpParams = Pick<Help, "image" | "title" | "description" | "tag" | "totalValue" | "userId">;
