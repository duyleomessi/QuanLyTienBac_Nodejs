var app = require("./app");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
var port = process.env.PORT || 8000;

app.listen(port, function() {
  console.log("Server listen on port " + port);
});
