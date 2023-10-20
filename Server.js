const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const app = require("./index");

// ESTABLISH A CONNECTION
mongoose.connect(process.env.CONN_STR, {
  useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
  console.log("DB connection successful!");
});

mongoose.connection.on("error", () => {
  console.log("Mongoose connection error");
});



// PORT
const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log("server has started!");
});
