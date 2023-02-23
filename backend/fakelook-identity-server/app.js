const express = require("express");
require('dotenv').config()
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const identityRoutes = require("./routes/identity");
const {errorHandler} = require("@bshfakelook/common");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/identity", identityRoutes);
app.use(errorHandler)

const URL = process.env.URL_DB_CONECTION;
mongoose
  .connect(URL)
  .then((res) => {
    app.listen(5001);
  })
  .catch((err) => console.log(err));