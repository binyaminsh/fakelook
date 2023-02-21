const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
// const isAuth = require("../middleware/is-auth");
const identityController = require("../controllers/identity");
const {
  requireAuth,
  currentUser,
  validateRequest,
} = require("@bshfakelook/common");

const router = express.Router();

router.get(
  "/user/:id",
  currentUser,
  requireAuth,
  identityController.getUserById
);

router.put(
  "/updateUser/:id",
  [
    body("name")
      .trim()
      .isLength({ max: 30, min: 1 })
      .withMessage("name must be between 1 and 30 characters"),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  identityController.updateUser
);

router.post(
  "/createUser",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user !== null) {
            return Promise.reject("email already in use");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ max: 30, min: 6 })
      .withMessage("Password must be between 6 and 30 characters"),
    body("username")
      .trim()
      .isLength({ max: 30, min: 1 })
      .withMessage("Username must be between 1 and 30 characters")
      .custom((value) => !/\s/.test(value))
      .withMessage("No spaces are allowed in the username")
      .not()
      .matches(/[^a-zA-Z0-9 ]/)
      .withMessage("Username canot contain spacial character")
      .custom((value) => {
        return User.findOne({ username: value }).then((user) => {
          if (user !== null) {
            return Promise.reject("username already in use");
          }
        });
      }),
  ],
  validateRequest,
  identityController.createUser
);

router.post("/createUserGoogle", identityController.createUserGoogle);

router.get("/users", currentUser, requireAuth, identityController.getAll);

module.exports = router;
