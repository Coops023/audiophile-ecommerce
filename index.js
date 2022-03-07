const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const cors = require("cors");

const app = express();
app.use(cors());

const logger = require("morgan");

//import your models

require("./models/Product");

mongoose
  .connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.log(err));

//middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In development environment the app logs
app.use(logger("dev"));

//import routes
require("./routes/productRoute.js")(app);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

const PORT = process.env.PORT || 5000;

// Accessing the path module
const path = require("path");

// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
