const express = require("express");
const EmployerData = require("../models/employer");
const JobData = require("../models/jobDescription");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { ObjectId } = require("mongodb");
const { request, application } = require("express");
const FilteredData = require("../models/filteredlist");

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
}

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

upload = multer({ storage: Storage }).single("file");

router.post("/login", (req, res) => {
  loginUser = req.body;
  var flag = false;

  EmployerData.find().then((employer) => {
    for (let i = 0; i < employer.length; i++) {
      if (
        loginUser.email == employer[i].email &&
        loginUser.password == employer[i].password
      ) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    console.log("flag", flag);
    if (flag == true) {
      let payload = { subject: loginUser.email + loginUser.password };
      let token = jwt.sign(payload, "secretKey");
      res.status(200).send({ token });
    } else {
      console.log("invalid ");
      res.status(401).send("Invalid Credentials");
    }
  });
});
router.post("/emplogin", (req, res) => {
  email = req.body.email;
  password = req.body.password;
  let paylaod = { subject: email + password };
  let token = jwt.sign(paylaod, "secretKey");
  console.log(token);
  res.status(200).send({ token });
});

router.get("/profile", verifyToken, (req, res) => {
  EmployerData.find({ _id: req.body.id }).then((employer) => {
    res.send(employer);
  });
});

router.post("/newjob", (req, res) => {
  const newJob = new JobData({
    employerId: req.body.employerId,
    designation: req.body.designation,
    jobDescription: req.body.jobDescription,
    vaccancies: req.body.vaccancies,
    salary: req.body.salary,
    experience: req.body.experience,
    postedDate: req.body.postedDate,
    lastDate: req.body.lastDate,
  });
  newJob.save().then(() => {
    res.send("new job inserted");
  });
});

////////////////////////////////////
router.get("/employers", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
  EmployerData.find().then(function (employers) {
    res.send(employers);
  });
});

router.get("/jobs", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
  JobData.find().then(function (jobs) {
    console.log(jobs);
    res.send(jobs);
  });
});

router.get("/jobs/:id", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
  var query = { employerId: req.params.id };

  JobData.find(query).then(function (jobs) {
    res.send(jobs);
  });
});
router.get("/getempbyid/:id", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
  console.log("the gen id is as follows:" + req.params.id);
  var query = { employerGenId: req.params.id };

  EmployerData.find(query).then(function (employer) {
    res.send(employer);
  });
});

router.get("/getempbyemail/:email", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
  console.log("the gen id is as follows:" + req.params.email);
  var query = { email: req.params.email };

  EmployerData.find(query).then(function (employer) {
    res.send(employer);
  });
});
router.get("/getjobsbyid/:id", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");

  var query = { employerGenId: req.params.id };
  JobData.find(query).then(function (jobs) {
    res.send(jobs);
  });
});

router.get("/getjobbyid/:id", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
  console.log("the job emp id is as follows:" + req.params.id);
  var query = { _id: req.params.id };
  JobData.findById(query).then(function (job) {
    res.send(job);
  });
});

router.get("/getemp/:name", (req, res) => {
  const name = req.params.name;

  console.log("inside /getemp");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");

  EmployerData.findOne({ employerName: name }).then((employer) => {
    res.send(employer);
  });
});
router.post("/insertemp", upload, function (req, res) {
  const Employer = new EmployerData({
    employerGenId: ObjectId(),
    companyName: req.body.employer.companyName,
    employerName: req.body.employer.employerName,
    designation: req.body.employer.designation,
    cin: req.body.employer.cin,
    phone: req.body.employer.phone,
    email: req.body.employer.email,
    state: req.body.employer.state,
    country: req.body.employer.country,
    password: req.body.employer.password,
  });

  Employer.save();
});
router.post("/insertjob", verifyToken, function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");

  var job = {
    employerGenId: req.body.job.employerGenId,
    jobId: ObjectId(),
    designation: req.body.job.designation,
    jobDescription: req.body.job.jobDescription,
    passoutYear: req.body.job.passoutYear,
    skills: req.body.job.skills,
    ictakCourse: req.body.job.ictakCourse,
    vaccancies: req.body.job.vaccancies,
    salary: req.body.job.salary,
    intern: req.body.job.intern,
    postedDate: req.body.job.postedDate,
    lastDate: req.body.job.lastDate,
    experience: req.body.job.experience,
    location: req.body.job.location,
    qualification: req.body.job.qualification,
  };

  var job = new JobData(job);

  job.save();
});

router.put("/update", verifyToken, (req, res) => {
  (employerGenId = req.body.employerGenId),
    (companyName = req.body.companyName),
    (employerName = req.body.employerName),
    (designation = req.body.designation),
    (cin = req.body.cin),
    (phone = req.body.phone),
    (email = req.body.email),
    (state = req.body.state),
    (country = req.body.country);

  EmployerData.updateOne(
    { employerGenId: employerGenId },
    {
      $set: {
        employerGenId: req.body.employerGenId,
        companyName: companyName,
        employerName: employerName,
        designation: designation,
        cin: cin,
        phone: phone,
        email: email,
        state: state,
        country: country,
      },
    }
  ).then(function () {
    res.send();
  });
});

router.put("/updatejob/:id", verifyToken, (req, res) => {
  (employerGenId = req.body.job.employerGenId),
    (jobId = req.body.job.JobId),
    (designation = req.body.job.designation),
    (jobDescription = req.body.job.jobDescription),
    (passoutYear = req.body.job.passoutYear),
    (skills = req.body.job.skills),
    (ictakCourse = req.body.job.ictakCourse),
    (vaccancies = req.body.job.vaccancies),
    (salary = req.body.job.salary),
    (intern = req.body.job.intern),
    (postedDate = req.body.job.postedDate),
    (lastDate = req.body.job.lastDate),
    (experience = req.body.job.experience),
    (location = req.body.job.location),
    (qualification = req.body.job.qualification);
  JobData.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        employerGenId: employerGenId,
        jobId: jobId,
        designation: designation,
        jobDescription: jobDescription,
        passoutYear: passoutYear,
        skills: skills,
        ictakCourse: ictakCourse,
        vaccancies: vaccancies,
        salary: salary,
        intern: intern,
        postedDate: postedDate,
        lastDate: lastDate,
        experience: experience,
        location: location,
        qualification: qualification,
      },
    }
  ).then(function () {
    res.send();
  });
});

router.get("/getshortlist/:shortListJobId", (req, res) => {
  jobId = req.params.shortListJobId;

  var query = { jobId: jobId };
  FilteredData.find(query).then(function (shortlists) {
    res.send(shortlists);
  });
});

router.delete("/remove/:id", verifyToken, (req, res) => {
  id = req.params.id;
  JobData.findByIdAndDelete({ _id: id }).then(() => {
    res.send();
  });
});

module.exports = router;
