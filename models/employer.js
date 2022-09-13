const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_URL);

const Schema = mongoose.Schema;

var employerSchema = new Schema({
  employerGenId:String,
  companyName: String,
  employerName: String,
  designation: String,
  cin: String,
  phone: String,
  email: String,
  state: String,
  country: String,
  profilePic: String,
  password: String,
});

var employerData = mongoose.model("EmployerData", employerSchema);
module.exports = employerData;
