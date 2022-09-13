const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_URL);
const Schema = mongoose.Schema;

var adminSchema = new Schema({
  username: String,
  password: String,
});

var adminData = mongoose.model("AdminData", adminSchema);
module.exports = adminData;
