import express from "express";
import { createServer } from "http";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
import config from "config";
import { json, urlencoded } from "body-parser";
import dbConnection from "./config/db.config";
import rabbitMqConnection from "./config/rabbitmq.config";
import { errorHandler } from "@bshfakelook/common";
import { NotFoundError } from "@bshfakelook/common";

import socketConnection, { initSocketIo } from "./socket";

const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express();
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

const httpServer = createServer(app);
initSocketIo(httpServer, corsOrigin);

// routes
app.all("*", () => {
  throw new NotFoundError();
});

(async () => {
  await dbConnection();
  await rabbitMqConnection();
  httpServer.listen(port);

  socketConnection();
})();
app.use(errorHandler);
