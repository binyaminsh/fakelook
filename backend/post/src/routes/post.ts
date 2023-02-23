import { currentUser, requireAuth, validateRequest } from "@bshfakelook/common";
import express from "express";
import { body, check, param } from "express-validator";
import PostController from "../controllers/post.controller";
const router = express.Router();

router.post(
  "/",
  [
    check("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("userId is required."),
    check("file")
      .custom((value, { req }) => {
        if (req.file.mimetype.startsWith("image")) {
          return "image";
        } else {
          return false;
        }
      })
      .withMessage("Image is required."),
    check("position") //TODO: isLatLong() need to be string not object.
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("location is required."),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  PostController.create
);

router.get(
  "/:postId",
  [
    param("postId")
      .trim()
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("postId is required."),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  PostController.findById
);

router.put(
  "/:postId",
  [
    param("postId")
      .trim()
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("postId is required."),
    body("userId").notEmpty().withMessage("userId is required."),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  PostController.update
  // TODO validatie User is the creator
);

router.delete(
  "/:postId",
  [
    param("postId")
      .trim()
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("postId is required."),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  PostController.delete
);

router.patch(
  "/likes/:postId",
  [
    param("postId")
      .trim()
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("postId is required."),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  PostController.likeToggle
);

router.put(
  "/comment/:postId",
  [
    param("postId")
      .trim()
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("postId is required."),
    body("content").trim().notEmpty().withMessage("content is required."),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  PostController.addComment
);

export = router;
