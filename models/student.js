const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_URL);

const Schema = mongoose.Schema;
var studentSchema = new Schema({
  dwmsid: String,
  studentName: String,
  email: String,
  phone: String,
  dob: String,
  course: String,
  exitexam: String,
  qualification: String,
  specialization: String,
  address: String,
  ClassX_Course: String,
  ClassX_Board: String,
  ClassX_Percentage: String,
  ClassX_YrOfPassing: String,
  ClassXII_Course: String,
  ClassXII_Board: String,
  ClassXII_Percentage: String,
  ClassXII_YrOfPassing: String,
  Graduation_Course: String,
  Graduation_University: String,
  Graduation_Percentage: String,
  Graduation_YrOfPassing: String,
  Masters_Course: String,
  Masters_University: String,
  Masters_Percentage: String,
  Masters_YrOfPassing: String,
  relocate: String,
  password: String,
  resume: String,
  profilePic: String,
  skillSet:String,
  passoutyear:String
});

var studentData = mongoose.model("StudentData", studentSchema);
module.exports = studentData;
