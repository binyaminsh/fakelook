import { User } from "../models/user.schema";

export const toPostDto = async (post: any) => {
  const user = await User.findOne({ _id: post.userId });

  if (!user) return null;

  const commentsDto = await Promise.all(post.comments.map(toCommentDto));
  return {
    id: post._id,
    comments: commentsDto,
    content: post.content,
    likes: post.likes,
    tags: post.tags,
    publisher: user.username, // replaces userId to username
    publisherName: user.name,
    lat: +post.location.lat,
    lng: +post.location.lng,
    time: post.createdAt,
    photoUrl: post.photoUrl,
  };
};

const toCommentDto = async (comment: any) => {
  let user;
  if (comment.userId.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findOne({ _id: comment.userId });
  } else {
    user = await User.findOne({ username: comment.userId });
  }

  if (!user) return null;

  return {
    id: comment._id,
    tags: comment.tags,
    content: comment.content,
    likes: comment.likes,
    createdAt: comment._id.getTimestamp(),
    publisher: user.username, // replaces userId to username
    publisherName: user.name,
  };
};
