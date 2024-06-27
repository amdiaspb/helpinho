import { Donation } from "../config/types";
import joi from "joi";

export const createDonationSchema = joi.object<CreateDonationParams>({
  value: joi.number().required(),
  helpId: joi.string().required(),
});

export type CreateDonationParams = Pick<Donation, "value" | "userId" | "helpId">;
