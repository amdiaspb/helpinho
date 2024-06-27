import { db } from "../config/database";
import { validateBody } from "../middlewares/validation-middleware";
import { Request, Response, Router } from "express";
import { Help } from "../config/types";
import httpStatus from "http-status";
import { CreateHelpParams, createHelpSchema } from "../schemas/help-schemas";
import { AuthenticatedRequest, authenticateToken } from "../middlewares/auth-middleware";

const helpRouter = Router();
helpRouter

// GET -> ALL =======================================================================

  .get("/", async (_req: Request, res: Response) => {
    const helps = db.help.map(h => {
      const help: any = {...h};

      const user = db.user.find(u => u.id === h.userId);
      if (user) {
        const { name, email, image } = user;
        help.user = { name, email, image };
      }

      help.helpDonated = db.donation.reduce((a, b) => {
        if (b.helpId === help.id) {
          if (!a[b.userId]) {
            a[b.userId] = true;
            a.images.push(db.user.find(u => u.id === b.userId).image);
            a.len++;
          }
        }
        return a;
      } , { images: [], len: 0 });

      delete help.userId;
      delete help.currentValue;
      delete help.totalValue;
      return help;
    })
    return res.json(helps);
  })
  

// GET -> ONE =======================================================================

  .get("/:id", async (req: Request, res: Response) => {
    const help = db.help.find(help => help.id === req.params.id);
    if (!help) return res.sendStatus(httpStatus.NOT_FOUND);

    let data: any = {...help};
    const user = db.user.find(u => u.id === help.userId);
    if (user) {
      const { name, email, image } = user;
      data.user = { name, email, image };
    }

    data.helpDonatedCount = db.donation.reduce((a, b) => {
      if (b.helpId === help.id) {
        if (!a[b.userId]) {
          a[b.userId] = true;
          a.len++;
        }
      }
      return a;
    } , { len: 0 }).len;

    return res.json(data);
  })

// AUTHENTICATED ROUTES =======================================================================

  .all("/*", authenticateToken)

// POST =======================================================================

  .post("/", validateBody(createHelpSchema), async (req: AuthenticatedRequest, res: Response) => {
    const data = { ...req.body, userId: req.userId } as CreateHelpParams;
    const help = new Help(data);
    
    db.help.push(help);
    return res.status(httpStatus.CREATED).json(data);
  })

// PUT =======================================================================

  .put("/:id", (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const helpIndex = db.help.findIndex(help => help.id === id);
    if (helpIndex === -1) return res.sendStatus(httpStatus.NOT_FOUND);

    const data = req.body;
    db.help[helpIndex] = data;
    res.json(data);
  })

// DELETE =======================================================================

  .delete("/:id", (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const helpIndex = db.help.findIndex(help => help.id === id);
    if (helpIndex === -1) return res.sendStatus(httpStatus.NOT_FOUND);

    const help = db.help.splice(helpIndex, 1);
    res.json(help);
  })

// Export =======================================================================

export { helpRouter };
