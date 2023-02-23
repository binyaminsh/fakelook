import { FilterQuery, UpdateQuery } from "mongoose";
import { CreatePostDto } from "../dto/create-post.dto";
import { IPost, Post } from "../models/post.schema";

export const create = (createPostDto: CreatePostDto) => {
  return Post.create(createPostDto);
};

export const findById = (id: string) => {
  return Post.findOne({ _id: id }).exec();
};

export const update = async (filter: FilterQuery<IPost>, update: UpdateQuery<IPost>) => {
  return Post.findOneAndUpdate(filter, update, { new: true}).exec();
};

export const remove = (id: string) => {
  return Post.findByIdAndDelete(id).exec();
};

export const findAll = () => {
  return Post.find().exec();
};

