const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_URL);

const Schema = mongoose.Schema;
var jobSchema = new Schema({
  employerGenId: String,
  // companyName: String,
  jobId: String,
  employerName: String,
  designation: String,
  jobDescription: String,
  passoutYear: String,
  skills: String,
  ictakCourse: String,
  vaccancies: String,
  salary: String,
  intern: String,
  postedDate: Date,
  lastDate: Date,
  experience: String,
  location: String,
  qualification: String,
});

var JobData = mongoose.model("JobData", jobSchema);
module.exports = JobData;
