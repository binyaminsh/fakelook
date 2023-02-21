const { connect} = require("amqplib");
let channel;
const amqpServer = process.env.AMQP_SERVER || "";
  
const createChannel = async () => {
  try {
    const connection = await connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("user_created", { durable: false });
    await channel.assertQueue("user_updated", { durable: false });
    await channel.assertQueue("user_deleted", { durable: false });
  } catch (error) {
    console.log(error);
  }
};

exports.publishMessage = async (queueName, message) => {
  if (!channel) {
    await createChannel();
  }

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};

