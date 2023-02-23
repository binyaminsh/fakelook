import { Channel } from "amqplib";
import { toPostDto } from "../mapper/postMapper";
import { Post } from "../models/post.schema";
import { onPostAdded, onPostUpdated } from "../socket";

export const consumePostMessage = async (channel: Channel) => {
  try {
    await channel.assertExchange("post-exchange", "direct");

    await channel.assertQueue("post_created", { durable: false });
    await channel.bindQueue("post_created", "post-exchange", "post_created");

    await channel.assertQueue("post_updated", { durable: false });
    await channel.bindQueue("post_updated", "post-exchange", "post_updated");

    await channel.assertQueue("post_deleted", { durable: false });

    await channel.consume("post_created", async (msg: any) => {
      const post = JSON.parse(msg?.content);

      // Make sure it haven't consumed the message already,
      // if for some reason the publisher publishes the same message twice
      const existingPost = await Post.findById(post._Id);
      if (existingPost) return; // nothing else to do

      await Post.create(post);
      channel.ack(msg);

      const postDto = await toPostDto(post);
      onPostAdded(postDto);
    });

    await channel.consume("post_updated", async (msg: any) => {
      const postData = JSON.parse(msg?.content);

      const postInDb = await Post.findOneAndUpdate(
        postData.filterQuery,
        postData.updateQuery,
        {
          new: true,
          upsert: true,
        }
      );
      channel.ack(msg);

      const postDto = await toPostDto(postInDb);
      onPostUpdated(postDto);
    });
  } catch (error) {
    console.log(error);
  }
};
