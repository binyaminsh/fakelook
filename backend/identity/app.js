const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const identityRoutes = require("./routes/identity");
const { errorHandler } = require("@bshfakelook/common");

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

<<<<<<< HEAD:backend/identity/app.js
app.use("/identity", identityRoutes);
app.use(errorHandler);
=======
app.use("/api/identity", identityRoutes);
app.use(errorHandler)
>>>>>>> 70059346afcbf15aada02620d2d39cae2cce2742:backend/fakelook-identity-server/app.js

const URL = process.env.URL_DB_CONECTION;
mongoose
  .connect(URL)
  .then((res) => {
    app.listen(5001);
  })
  .catch((err) => console.log(err));
