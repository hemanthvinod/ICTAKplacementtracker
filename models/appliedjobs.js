const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_URL);
const Schema = mongoose.Schema;

var appliedjobSchema = new Schema({
    studentid:String,
    employerGenId: String,
    jobId:String,
    designation:String,
    passoutyear:String,
    skills:String,
    ictakcourse:String,
    vaccancies:String,
    salary:String,
    intern:String,
    experience:String,
    postedDate:String,
    lastDate:String
});

var AppliedJobData = mongoose.model("AppliedJobData", appliedjobSchema);
module.exports = AppliedJobData;