import { Router } from "express";
import { registerUser, testController } from "../controllers/apiController.js";
import { validateRegInput } from "../middleware/validateRegister.js";

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.send("OK");
});

apiRouter.get("/test", testController);

// create a new user
apiRouter.post("/register", validateRegInput, registerUser);

export { apiRouter };
