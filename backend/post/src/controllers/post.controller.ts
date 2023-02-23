import { NotFoundError } from "@bshfakelook/common";
import { Request, Response, NextFunction } from "express";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  create,
  findById,
  remove,
  update,
  findAll,
} from "../DAL/post-repository";
import { IPost } from "../models/post.schema";
import { publishMessage } from "../services/event-communication-service";
import { uploadImage } from "../services/helpers";

export default class PostController {
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let fileName = '';

      if (req.file) {
        const image = req.file;
        fileName = await uploadImage(image);
      }

      const photoUrl = fileName;
      const { userId, content } = req.body;
      const position = JSON.parse(req.body.position);
      const hashTags = JSON.parse(req.body.tags);
      const userTags = JSON.parse(req.body.userTags);

      const postDetails = {
        userId,
        location: position,
        tags: { hashTags, userTags },
        content,
        photoUrl,
      };

      const post = await create(postDetails);
      await publishMessage("post_created", post);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  };
  static findAll = async (req: Request, res: Response, next: NextFunction) => {
    const posts = await findAll();

    res.status(200).json(posts);
  };

  static findById = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    try {
      const post = await findById(postId);
      if (!post) {
        throw new NotFoundError();
      }
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const { userId, content, hashTags, userTags } = req.body;

    const filterQuery: FilterQuery<IPost> = { _id: postId, userId };
    const updateQuery: UpdateQuery<IPost> = {
      $set: {
        content: content,
        "tags.hashTags": hashTags,
        "tags.userTags": userTags,
      },
    };

    try {
      const post = await update(filterQuery, updateQuery);

      if (post) {
        await publishMessage("post_updated", { filterQuery, updateQuery });
      }
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    try {
      await remove(postId);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  static addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const postId = req.params.postId;
    const { userId, content, hashTags, userTags } = req.body;
    const comment = { userId, content, tags: { hashTags, userTags } };

    const filterQuery: FilterQuery<IPost> = { _id: postId };
    const updateQuery: UpdateQuery<IPost> = {
      $addToSet: { comments: comment },
    };

    try {
      const post = await update(filterQuery, updateQuery);
      if (post) {
        await publishMessage("post_updated", { filterQuery, updateQuery });
      }
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  static likeToggle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const postId = req.params.postId;
    const { userId, commentId, likeType } = req.body;

    let filterQuery: FilterQuery<IPost>;
    let updateQuery: UpdateQuery<IPost>;

    if (commentId) {
      filterQuery = { _id: postId, "comments._id": commentId };
      likeType === LikeType.like
        ? (updateQuery = { $addToSet: { "comments.$.likes": userId } })
        : (updateQuery = { $pull: { "comments.$.likes": userId } });
    } else {
      filterQuery = { _id: postId };
      likeType === LikeType.like
        ? (updateQuery = { $addToSet: { likes: userId } })
        : (updateQuery = { $pull: { likes: userId } });
    }

    try {
      const post = await update(filterQuery, updateQuery);

      await publishMessage("post_updated", { filterQuery, updateQuery });

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };
}

enum LikeType {
  like = 1,
  unLike = -1,
}
