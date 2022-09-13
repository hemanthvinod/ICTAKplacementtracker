const express = require("express");
const AdminData = require("../models/admin");
const StudentData = require("../models/student");
const EmployerData = require("../models/employer");
const jobpost = require("../models/jobDescription");
const router = express.Router();
const jwt = require("jsonwebtoken");
const studentData = require("../models/student");
const { db } = require("../models/admin");
const FilterData = require("../models/filteredlist");
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

router.post("/signup", (req, res) => {
  console.log(req.body);
  const admin = new AdminData({
    username: req.body.email,
    password: req.body.password,
  });
  admin.save().then(() => {
    res.send("Saved");
  });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  loginUser = req.body;
  var flag = false;
  AdminData.find().then((user) => {
    console.log(user);
    for (let i = 0; i < user.length; i++) {
      if (
        loginUser.username == user[i].username &&
        loginUser.password == user[i].password
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
      res.status(401).send("Invalid Credentials");
    }
  });
});

router.get("/getStudents", (req, res) => {
  StudentData.find().then((students) => {
    res.send(students);
  });
});

router.get("/filterStudents", (req, res) => {
  StudentData.find({ qualification: req.body.qualification }).then(
    (students) => {
      res.send(students);
    }
  );
});

router.post("/postjobs", (req, res) => {
  console.log("routes" + req.body);
  const jobdata = new jobpost({
    employerid: req.body.employerid,
    designation: req.body.designation,
    jobdescription: req.body.jobdescription,
    passoutyear: req.body.passoutyear,
    skills: req.body.skills,
    ictakcourse: req.body.ictakcourse,
    vaccancies: req.body.vaccancies,
    salary: req.body.salary,
    intern: req.body.intern,
    postedDate: req.body.postedDate,
    lastDate: req.body.lastDate,
    experience: req.body.experience,
  });
  console.log("Job Data" + jobdata);
  jobdata.save().then(() => {
    res.send("Saved");
  });
});

// active jobs count

router.get("/jobscount", (req, res, next) => {
  jobpost.aggregate(
    [
      {
        $group: {
          _id: 1,
          count: {
            $sum: 1,
          },
        },
      },
    ],
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    }
  );
});

// List all active Jobs

router.get("/getjobs", (req, res) => {
  jobpost.find().then((jobs) => {
    res.send(jobs);
  });
});

router.delete("/deleteStudent", (req, res) => {
  StudentData.findByIdAndDelete({ _id: req.body.id }).then(() => {
    res.send("Deleted");
  });
});

// students count on admin home page

router.get("/studentcount", (req, res, next) => {
  StudentData.aggregate(
    [
      {
        $group: {
          _id: 1,
          count: {
            $sum: 1,
          },
        },
      },
    ],
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    }
  );
});

// add new employer

router.post("/addEmployer", (req, res) => {
  const Employer = new EmployerData({
    companyName: req.body.companyName,
    employerName: req.body.employerName,
    designation: req.body.designation,
    cin: req.body.cin,
    phone: req.body.phone,
    email: req.body.email,
    state: req.body.state,
    country: req.body.country,
    profilePic: req.body.profilePic,
    password: req.body.password,
  });
  Employer.save().then(() => {
    res.send("Employer data saved ");
  });
});

router.get("/getEmployers", (req, res) => {
  EmployerData.find().then((employers) => {
    res.send(employers);
  });
});

router.get("/getEmployers/:id", (req, res) => {
  const id = req.params.id;
  EmployerData.findOne({ _id: id }).then((employers) => {
    res.send(employers);
  });
});

// update emploer password

router.put("/updateemployerpass", (req, res) => {
  console.log(req.body);
  id = req.body.employerid;
  password = req.body.newpassword;
  EmployerData.findByIdAndUpdate(
    { _id: id },
    { $set: { password: password } }
  ).then(function () {
    res.send();
  });
});

// employer count on admin home page

router.get("/employercount", (req, res, next) => {
  EmployerData.aggregate(
    [
      {
        $group: {
          _id: 1,
          count: {
            $sum: 1,
          },
        },
      },
    ],
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    }
  );
});

router.post("/filterdata/", (req, res) => {
  const empid = req.body.data.filterEmpId;
  const jobid = req.body.data.filterjobId;
  shortlist = req.body.data.student;
  shortlist.forEach((element) => {
    const data = new FilterData({
      studentid: element._id,
      employerGenId: empid,
      jobId: jobid,
      studentName: element.studentName,
      course: element.course,
      qualification: element.qualification,
      passoutyear: element.passoutyear,
      experience: element.experience,
    });
    data.save();
  });
});

router.put("/updatestudentpass", (req, res) => {
  id = req.body._id;
  password = req.body.password;
  studentData
    .findByIdAndUpdate({ _id: id }, { $set: { password: password } })
    .then(function () {
      res.send();
    });
});

router.get("/getStudents/:id", (req, res) => {
  const id = req.params.id;
  studentData.findOne({ _id: id }).then((employers) => {
    res.send(employers);
  });
});

router.get("/removejob/:id", (req, res) => {
  id = req.params.id;
  jobpost.findByIdAndDelete({ _id: id }).then(() => {
    res.send();
  });
});

module.exports = router;
