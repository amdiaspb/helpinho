import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateBody } from "../middlewares/validation-middleware";
import { Request, Response, Router } from "express";
import { UserData} from "../config/types";
import httpStatus from "http-status";
import { authSchema } from "../schemas/auth-schemas";
import { userRepository } from "../repositories/user-repository";
import { sessionRepository } from "../repositories/session-repository";

const authRouter = Router();
authRouter

// LOGIN =======================================================================

  .post("/", validateBody(authSchema), async (req: Request, res: Response) => {
    const data = req.body;
    const user = await userRepository.getByEmail(data.email) as UserData;
    if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

    // valid: correct password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) return res.sendStatus(httpStatus.UNAUTHORIZED);

    // create: token and session 
    const { PK, name, email, image } = user;
    const token = jwt.sign({ userId: PK }, process.env.JWT_SECRET);
    await sessionRepository.put(PK, token);

    // return: info
    const info = { user: { name, email, image }, token };
    return res.status(201).json(info);
  });

// Export =======================================================================

export { authRouter };
