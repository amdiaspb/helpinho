import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routers/auth-router";
import { userRouter } from "./routers/user-router";
import { helpRouter } from "./routers/help-router";
import { donationRouter } from "./routers/donation-router";
import ServerlessHttp from "serverless-http";

dotenv.config();
const app = express();
app
  .use(cors())
  .use(json())
  .get("/health", (_req, res) => res.send("OK!"))

  .use("/auth", authRouter)
  .use("/user", userRouter)
  .use("/help", helpRouter)
  .use("/donation", donationRouter)

export const handler = ServerlessHttp(app);

/* const port = +process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at port ${port}...`);
}); */
