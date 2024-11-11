import { Router } from "express";
import {
  registerUser,
  testController,
  userLogin,
} from "../controllers/apiController.js";
import {
  validateLoginInput,
  validateRegInput,
} from "../middleware/validateRegister.js";

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.send("OK");
});

apiRouter.get("/test", testController);

// create a new user
apiRouter.post("/register", validateRegInput, registerUser);

// log in
apiRouter.post("/login", validateLoginInput, userLogin);

export { apiRouter };
