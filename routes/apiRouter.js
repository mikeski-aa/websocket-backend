import { Router } from "express";
import {
  registerUser,
  testController,
  userLogin,
  oneClickLogin,
  updateUserWins,
  updateUserLosses,
  updateUserDraws,
  forceUpdateForDcLoss,
  getLeaderboard,
} from "../controllers/apiController.js";
import {
  validateLoginInput,
  validateRegInput,
} from "../middleware/validateRegister.js";
import { verifyTokenMiddleware } from "../middleware/verifyToken.js";

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.send("OK");
});

apiRouter.get("/test", testController);

// create a new user
apiRouter.post("/register", validateRegInput, registerUser);

// log in
apiRouter.post("/login", validateLoginInput, userLogin);

// token test
apiRouter.get("/token", oneClickLogin);

// update wins
apiRouter.put("/wins", verifyTokenMiddleware, updateUserWins);

// update losses
apiRouter.put("/loss", verifyTokenMiddleware, updateUserLosses);

// update draws
apiRouter.put("/draw", verifyTokenMiddleware, updateUserDraws);

// update losses for DC
apiRouter.put("/dcloss", forceUpdateForDcLoss);

// get leaderboard
apiRouter.get("/leaderboards", getLeaderboard);

export { apiRouter };
