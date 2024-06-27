import { db } from "../config/database";
import bcrypt from "bcrypt";
import { validateBody } from "../middlewares/validation-middleware";
import { Request, Response, Router } from "express";
import { User } from "../config/types";
import httpStatus from "http-status";
import { CreateUserParams, createUserSchema } from "../schemas/user-schemas";
import { AuthenticatedRequest, authenticateToken } from "../middlewares/auth-middleware";
import axios from "axios";

const userRouter = Router();
userRouter

// SIGNUP =======================================================================

  .post("/", validateBody(createUserSchema), async (req: Request, res: Response) => {
    const data = req.body as CreateUserParams;
    const user = db.user.find(user => user.email === data.email);
    if (user) return res.sendStatus(httpStatus.CONFLICT);

    data.password = await bcrypt.hash(data.password, 12);

    /* const pokemon: any = await axios.get('https://pokeapi.co/api/v2/pokemon/2');
    console.log(pokemon.data.sprites.other.dream_world.front_default); */

    db.user.push(new User(data));
    return res.status(httpStatus.CREATED).json(data);
  })

// AUTHENTICATED ROUTES =======================================================================

  .all("/*", authenticateToken)

// GET =======================================================================

  .get("/", async (req: AuthenticatedRequest, res: Response) => {
    const user = db.user.find(user => user.id === req.userId);
    if (!user) return res.sendStatus(httpStatus.NOT_FOUND);

    let data: any = {...user};
    data.helpCreatedCount = db.help.reduce((a, b) => {
      if (b.userId === data.id) a++;
      return a;
    } , 0);

    data.helpDonatedCount = db.donation.reduce((a, b) => {
      if (b.userId === data.id) {
        if (!a[b.helpId]) {
          a[b.helpId] = true;
          a.len++;
        }
      }
      return a;
    } , { len: 0 }).len;

    data.helpDonatedValue = db.donation.reduce((a, b) => {
      if (b.userId === data.id) a += b.value;
      return a;
    } , 0);

    return res.json(data);
  })

// PUT =======================================================================

  .put("/:id", (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userIndex = db.user.findIndex(user => user.id === id);
    if (userIndex === -1) return res.sendStatus(httpStatus.NOT_FOUND);

    const data = {id, ...req.body};
    const user = db.user.find(user => user.email === data.email);
    if (user) return res.sendStatus(httpStatus.CONFLICT);

    db.user[userIndex] = data;
    res.json(data);
  })

// DELETE =======================================================================

  .delete("/:id", (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userIndex = db.user.findIndex(user => user.id === id);
    if (userIndex === -1) return res.sendStatus(httpStatus.NOT_FOUND);

    const user = db.user.splice(userIndex, 1);
    res.json(user);
  })

// DEV =======================================================================

.get("/dev", async (req: AuthenticatedRequest, res: Response) => {
  const user = db.user.find(user => user.id === req.userId);
  if (!user) return res.sendStatus(httpStatus.NOT_FOUND);

  let data: any = {...user};
  return res.json(data);
})

// Export =======================================================================

export { userRouter };
