import { connect, Channel } from "amqplib";
import { consumePostMessage } from "../consumers/post-message-consumer";
import { consumeUserMessage } from "../consumers/user-message-consumer";
let channel: Channel;

const amqpServer = process.env.AMQP_SERVER || "";

const rabbitMqConnection = async () => {
  try {
    const connection = await connect(amqpServer);
    channel = await connection.createChannel();
    await consumePostMessage(channel);
    await consumeUserMessage(channel);
  } catch (error) {
    console.log("Connection to amqp failed");
  }
};
export default rabbitMqConnection;