import express from "express";
import compression from "compression";
import helmet from "helmet";
// In development only.
// import * as dotenv from "dotenv";
// dotenv.config();
import cors from "cors";
import { json, urlencoded } from "body-parser";
import dbConnection from "./config/db.config";
import { errorHandler } from "@bshfakelook/common";
import { NotFoundError } from "@bshfakelook/common";
import postsRoutes from "./routes/posts";
import postRoutes from "./routes/post";
import multer from "multer";

const app = express();
const upload = multer({ preservePath: true });
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(upload.single("file"));
app.use(urlencoded({ extended: true }));
app.use(json());

// routes
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api/posts", postsRoutes);
app.use("/api/post", postRoutes);
app.all("*", () => {
  throw new NotFoundError();
});

(async () => {
  await dbConnection();
  app.listen(5002);
})();
app.use(errorHandler);
