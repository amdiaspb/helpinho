import { db } from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateBody } from "../middlewares/validation-middleware";
import { Request, Response, Router } from "express";
import { Session } from "../config/types";
import httpStatus from "http-status";
import { authSchema } from "../schemas/auth-schemas";

const authRouter = Router();
authRouter

// LOGIN =======================================================================

  .post("/", validateBody(authSchema), async (req: Request, res: Response) => {
    const data = req.body;
    const user = db.user.find(user => user.email === data.email);
    if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

    // valid: correct password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) return res.sendStatus(httpStatus.UNAUTHORIZED);

    // create: token and session
    const { id, name, email, image } = user;
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET);
    const index = db.session.findIndex(session => session.userId === id);
    if (index > -1) {
      db.session[index] = new Session(id, token);
    } else {
      db.session.push(new Session(id, token));
    }

    // return: info
    const info = { user: { name, email, image }, token };
    return res.status(httpStatus.CREATED).json(info);
  });

// Export =======================================================================

export { authRouter };
