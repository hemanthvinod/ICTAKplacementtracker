const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_URL);

const Schema = mongoose.Schema;
var registeredSchema = new Schema({
  email: String,
});

var registeredMail = mongoose.model("RegisteredMail", registeredSchema);
module.exports = registeredMail;
