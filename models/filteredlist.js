const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_URL);
const Schema = mongoose.Schema;

var filteredlistSchema = new Schema({
    studentid:String,
    employerGenId: String,
    jobId:String,
    studentName:String,
    course:String,
    qualification:String,
    passoutyear:String,
    experience:String
  
});

var FilteredData = mongoose.model("FilteredData", filteredlistSchema);
module.exports = FilteredData;