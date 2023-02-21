import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import dbConnection from "./config/db.config";
import authRoutes from "./routes/auth";
import { errorHandler  } from "@bshfakelook/common";
import { NotFoundError  } from "@bshfakelook/common";
const app = express();

app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/auth", authRoutes);
app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

(async () => {
  await dbConnection();
  app.listen(5000);
})();

