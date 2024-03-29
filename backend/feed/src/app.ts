import express from "express";
import helmet from "helmet";
import { createServer } from "http";
// In development only.
// import * as dotenv from "dotenv";
// dotenv.config();
import cors from "cors";
import config from "config";
import { json, urlencoded } from "body-parser";
import dbConnection from "../config/db.config";
import rabbitMqConnection from "../config/rabbitmq.config";
import { errorHandler, NotFoundError } from "@bshfakelook/common";
import socketConnection, { initSocketIo } from "./socket";

const port = config.get<number>("port") || 5003;
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin") || "*";

const app = express();
app.use(helmet());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

const httpServer = createServer(app);
initSocketIo(httpServer, corsOrigin);
// routes
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});
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
