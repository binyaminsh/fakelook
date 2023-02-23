import express from "express";
import { body } from "express-validator";
import {
  signup,
  login,
  googleSigning,
  // requestPasswordReset,
  // resetPassword,
} from "../controllers/auth";
import { validateRequest } from "@bshfakelook/common";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("username").notEmpty(),
    body("password")
      .trim()
      .isLength({ max: 30, min: 6 })
      .withMessage("Password must be between 6 and 30 characters"),
  ],
  validateRequest,
  signup
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password."),
  ],
  validateRequest,
  login
);

router.post("/google", googleSigning);
// router.post("/requestResetPassword", requestPasswordReset);
// router.post(
//   "/resetPassword",
//   [
//     body("newPassword")
//       .trim()
//       .isLength({ max: 30, min: 6 })
//       .withMessage("Password must be between 6 and 30 characters"),
//   ],
//   validateRequest,
//   resetPassword
// );

export = router;
