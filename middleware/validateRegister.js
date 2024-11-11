import { body, validationResult } from "express-validator";

const validateRegInput = [
  body("username").isLength({ min: 1, max: 16 }).trim().notEmpty(),
  body("password").exists().isLength({ min: 4, max: 16 }).trim().escape(),
  body("confirmPassword")
    .exists()
    .trim()
    .isLength({ min: 4, max: 16 })
    .escape(),

  (req, res, next) => {
    const result = validationResult(req);
    // errors detected
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    // check passwords match
    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).json({ errors: "Passwords do not match!" });
    }

    // validation successful
    return next();
  },
];

const validateLoginInput = [
  body("username").isLength({ min: 1, max: 16 }).trim().notEmpty(),
  body("password").exists().isLength({ min: 4, max: 16 }).trim().escape(),
  (req, res, next) => {
    const result = validationResult(req);
    // errors detected
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    // validation successful
    return next();
  },
];

export { validateRegInput, validateLoginInput };
