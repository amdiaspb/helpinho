import bcrypt from "bcrypt";
import { validateBody } from "../middlewares/validation-middleware";
import { Request, Response, Router } from "express";
import httpStatus from "http-status";
import { CreateUserParams, createUserSchema } from "../schemas/user-schemas";
import { AuthenticatedRequest, authenticateToken } from "../middlewares/auth-middleware";
import { userRepository } from "../repositories/user-repository";

const userRouter = Router();
userRouter

// SIGNUP =======================================================================

  .post("/", validateBody(createUserSchema), async (req: Request, res: Response) => {
    const data = req.body as CreateUserParams;
    const user = await userRepository.getByEmail(data.email);
    if (user) return res.status(httpStatus.CONFLICT).json(user);

    data.password = await bcrypt.hash(data.password, 12);
    await userRepository.create(data);

    return res.status(201).json(data);
  })

// AUTHENTICATED ROUTES =======================================================================

  .all("/*", authenticateToken)

// GET =======================================================================

  .get("/", async (req: AuthenticatedRequest, res: Response) => {
    const user = await userRepository.getQueryByPK(req.userId);
    if (!user) return res.sendStatus(httpStatus.NOT_FOUND);

    const data: any = user.find(item => item.SK.includes("#Data"));
    data.helpDonated = user.reduce((a, b) => {
      if (b.SK.includes("DONATION")) {
        if (!a.unique[b.helpId]) {
          a.unique[b.helpId] = true;
          a.count++;
        }
        a.value += b.value;
      }
      return a;
    } , { count: 0, value: 0, unique: {} });

    delete data.helpDonated.unique;
    return res.json(data);
  })

// DEV =======================================================================

/* .get("/dev", async (req: AuthenticatedRequest, res: Response) => {
  const user = db.user.find(user => user.id === req.userId);
  if (!user) return res.sendStatus(httpStatus.NOT_FOUND);

  let data: any = {...user};
  return res.json(data);
}) */

// Export =======================================================================

export { userRouter };
