import { Router } from "express";
import { testController } from "../controllers/apiController.js";
import bcrypt from "bcryptjs";

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.send("OK");
});

apiRouter.get("/test", testController);

export { apiRouter };
