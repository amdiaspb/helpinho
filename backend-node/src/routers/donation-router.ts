import { db } from "../config/database";
import { validateBody } from "../middlewares/validation-middleware";
import { Request, Response, Router } from "express";
import { Donation } from "../config/types";
import httpStatus from "http-status";
import { AuthenticatedRequest, authenticateToken } from "../middlewares/auth-middleware";
import { CreateDonationParams, createDonationSchema } from "../schemas/donation-schemas";

const donationRouter = Router();
donationRouter

// AUTHENTICATED ROUTES =======================================================================

  .all("/*", authenticateToken)

// GET =======================================================================

  .get("/", async (_req, res) => {
    return res.json(db.donation);
  })

// POST =======================================================================

  .post("/", validateBody(createDonationSchema), async (req: AuthenticatedRequest, res: Response) => {
    const data = req.body as CreateDonationParams;
    data.userId = req.userId;
    const user = db.user.find(user => user.id === data.userId);
    const help = db.help.find(help => help.id === data.helpId);
    if (!user || !help) return res.sendStatus(httpStatus.NOT_FOUND);
    if (user.id === help.userId) return res.sendStatus(httpStatus.BAD_REQUEST);
    
    if (help.currentValue >= help.totalValue) return res.sendStatus(httpStatus.BAD_REQUEST);
    if (user.money < data.value) return res.sendStatus(httpStatus.BAD_REQUEST);
    if ((help.currentValue + data.value) > help.totalValue) data.value = help.totalValue - help.currentValue;

    user.money -= data.value;
    help.currentValue += data.value;

    const donation = new Donation(data);
    db.donation.push(donation);
    return res.status(httpStatus.CREATED).json(donation);
  })

// Export =======================================================================

export { donationRouter };
