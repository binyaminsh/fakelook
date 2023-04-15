import express from "express";
import compression from "compression";
import helmet from "helmet";
// In development only.
// import * as dotenv from "dotenv";
// dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import dbConnection from "./config/db.config";
import authRoutes from "./routes/auth";
import { errorHandler } from "@bshfakelook/common";
import { NotFoundError } from "@bshfakelook/common";

const app = express();
app.use(compression());
app.use(helmet());

app.use(cors());
app.use(bodyParser.json());

// routes
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api/auth", authRoutes);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

(async () => {
  await dbConnection();
  app.listen(5000);
})();
