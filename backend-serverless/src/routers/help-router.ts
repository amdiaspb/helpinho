import { validateBody } from "../middlewares/validation-middleware";
import { Request, Response, Router } from "express";
import { UserData } from "../config/types";
import httpStatus from "http-status";
import { CreateHelpParams, createHelpSchema } from "../schemas/help-schemas";
import { AuthenticatedRequest, authenticateToken } from "../middlewares/auth-middleware";
import { helpRepository } from "../repositories/help-repository";
import { userRepository } from "../repositories/user-repository";

const helpRouter = Router();
helpRouter

// GET -> ALL =======================================================================

  .get("/", async (_req: Request, res: Response) => {
    const helps = await helpRepository.getAll();

    return res.json(helps);
  })

// GET -> ONE =======================================================================

  .get("/:id", async (req: Request, res: Response) => {
    const help = await helpRepository.getQueryByPK('Help#' + req.params.id);
    if (!help) return res.sendStatus(httpStatus.NOT_FOUND);

    const data = help.reduce((obj, item) => {
      if (item.SK.includes("Data")) obj = { ...item };
      if (item.SK.includes("User")) obj.user = item;
      if (item.SK.includes("DONATION")) {
        if (!obj.helpDonatedCount) obj.helpDonatedCount = 1;
        else obj.helpDonatedCount++;
      }
      return obj;
    }, {});

    return res.json(data);
  })

// AUTHENTICATED ROUTES =======================================================================

  .all("/*", authenticateToken)

// POST =======================================================================

  .post("/", validateBody(createHelpSchema), async (req: AuthenticatedRequest, res: Response) => {
    const data = { ...req.body, userId: req.userId } as CreateHelpParams;

    const result = await helpRepository.createData(data);
    const user = await userRepository.getByPK(data.userId) as UserData;
    await userRepository.increaseCreatedHelpCount(user);
    await helpRepository.createUser(result.PK, user);
    
    return res.status(201).json("CREATED");
  })

// Export =======================================================================

export { helpRouter };
