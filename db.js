var mongoose = require("mongoose");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

var MONGO_URI = process.env.MONGO_URI;
mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true }
);
mongoose.connection.on("error", err => {
  console.error(err);
  process.exit();
});
