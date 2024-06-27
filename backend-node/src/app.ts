import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/database";
import { authRouter } from "./routers/auth-router";
import { userRouter } from "./routers/user-router";
import { helpRouter } from "./routers/help-router";
import { donationRouter } from "./routers/donation-router";

dotenv.config();
const app = express();
app
  .use(cors())
  .use(json())
  .get("/health", (_req, res) => res.send("OK!"))
  .get("/test", (_req, res) => res.json(db))

  .use("/auth", authRouter)
  .use("/user", userRouter)
  .use("/help", helpRouter)
  .use("/donation", donationRouter)

const port = +process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at port ${port}...`);
});
