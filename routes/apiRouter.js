import { Router } from "express";
import { registerUser, testController } from "../controllers/apiController.js";
import { validateRegInput } from "../middleware/validateRegister.js";

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.send("OK");
});

apiRouter.get("/test", testController);

apiRouter.post("/register", validateRegInput, registerUser);

export { apiRouter };
