const mongoose = require("mongoose");
const express = require("express");

const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const backendRoutes = require("./routes/backend");
const frontendRoutes = require("./routes/frontend");

require('dotenv').config();

mongoose
  .connect(
    `mongodb+srv://becode_lyp:${process.env.MONGODB_PW}@cluster0.d7yoz.mongodb.net/loopyourbox?retryWrites=true&w=majority`,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Fail to connect to database"));

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use(express.static("./public"));

app.use(cookieParser());

app.use(methodOverride("_method"));

app.use("/api/", backendRoutes);
app.use("/", frontendRoutes);


module.exports = app;