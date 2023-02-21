import { Channel } from "amqplib";
import { toUserDto } from "../mapper/userMapper";
import { User } from "../models/user.schema";
import { onUserAdded, onUserUpdated } from "../socket";

export const consumeUserMessage = async (channel: Channel) => {
  try {
    await channel.assertQueue("user_created", { durable: false });
    await channel.assertQueue("user_updated", { durable: false });
    await channel.assertQueue("user_deleted", { durable: false });

    await channel.consume("user_created", async (msg: any) => {
      const user = JSON.parse(msg?.content);

      // Make sure it haven't consumed the message already,
      // if for some reason the publisher publishes the same message twice
      const existingUser = await User.findById(user._Id);
      if (existingUser) return; // nothing else to do

      await User.create(user);
      channel.ack(msg);

      const userDto = toUserDto(user);
      onUserAdded(userDto);
    });

    await channel.consume("user_updated", async (msg: any) => {
      const userData = JSON.parse(msg?.content);

      const userInDb = await User.findOneAndUpdate(
        userData.filter,
        userData.update,
        {
          new: true,
          upsert: true,
        }
      );
      channel.ack(msg);

      const userDto = toUserDto(userInDb);
      onUserUpdated(userDto);
    });
  } catch (error) {
    console.log(error);
  }
};
