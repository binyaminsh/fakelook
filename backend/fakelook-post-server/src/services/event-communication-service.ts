import { connect, Channel } from "amqplib";
let channel: Channel;
const amqpServer =
  "amqps://tmijedaz:trbSZmGtbG81P1YgQZ4ch4iL9vAfq82o@goose.rmq2.cloudamqp.com/tmijedaz";

export const createChannel = async () => {
  try {
    const connection = await connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertExchange("post-exchange", "direct");
    // TODO: 
    // await channel.assertQueue("post_created", { durable: false });
    // await channel.assertQueue("post_updated", { durable: false });
    // await channel.assertQueue("post_deleted", { durable: false });
  } catch (error) {
    console.log("Connection to amqp failed");
  }
};

export const publishMessage = async (queueName: string, message: any) => {
  if (!channel) {
    await createChannel();
  }

  // channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  channel.publish("post-exchange", queueName, Buffer.from(JSON.stringify(message)));
};
