import { validateBody } from "../middlewares/validation-middleware";
import { Response, Router } from "express";
import { HelpData, UserData } from "../config/types";
import httpStatus from "http-status";
import { AuthenticatedRequest, authenticateToken } from "../middlewares/auth-middleware";
import { CreateDonationParams, createDonationSchema } from "../schemas/donation-schemas";
import { userRepository } from "../repositories/user-repository";
import { helpRepository } from "../repositories/help-repository";
import { donationRepository } from "../repositories/donation-repository";

const donationRouter = Router();
donationRouter

// AUTHENTICATED ROUTES =======================================================================

  .all("/*", authenticateToken)

// POST =======================================================================

  .post("/", validateBody(createDonationSchema), async (req: AuthenticatedRequest, res: Response) => {
    const data = req.body as CreateDonationParams;
    const { userId } = req;

    // check: if user && helpinho exists
    const user = await userRepository.getByPK(userId) as UserData;
    const help = await helpRepository.getByPK(data.helpId) as HelpData;
    if (!user || !help) return res.sendStatus(httpStatus.NOT_FOUND);

    // check: not from self
    if (user.PK === help.userId) return res.sendStatus(httpStatus.BAD_REQUEST);
    
    // check: if help value is completed && if you have enough money
    if (help.currentValue >= help.totalValue) return res.sendStatus(httpStatus.BAD_REQUEST);
    if (user.money < data.value) return res.sendStatus(httpStatus.BAD_REQUEST);

    // calculate and update values
    if ((help.currentValue + data.value) > help.totalValue) data.value = help.totalValue - help.currentValue;
    await userRepository.updateMoney(user, user.money - data.value);
    await helpRepository.updateCurrentValue(help, help.currentValue + data.value);

    // new donation
    await donationRepository.createUserDonation(data, userId);
    await donationRepository.createHelpDonation(help.PK, user);

    return res.status(201).json("CREATED");
  })

// Export =======================================================================

export { donationRouter };
