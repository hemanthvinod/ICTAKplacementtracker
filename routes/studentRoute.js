const { application } = require("express");
const express = require("express");
const router = express.Router();
const StudentData = require("../models/student");
const jwt = require("jsonwebtoken");
const JobData = require("../models/jobDescription");

const multer = require("multer");
const registeredMail = require("../models/registeredMail");
const AppliedJobData = require("../models/appliedjobs");

// Verify Token Method
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

// Route for Student login
router.post("/login", (req, res) => {
  loginUser = req.body;
  var flag = false;
  StudentData.find().then((student) => {
    for (let i = 0; i < student.length; i++) {
      if (
        loginUser.email == student[i].email &&
        loginUser.password == student[i].password
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

// File Upload Using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "dist/frontend/assets/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });
var uploadMultiple = upload.fields([{ name: "file1" }, { name: "file2" }]);

// Route for student to register their details
router.post("/addStudent", uploadMultiple, (req, res) => {
  var student = {
    dwmsid: req.body.dwmsid,
    studentName: req.body.studentName,
    email: req.body.email,
    phone: req.body.phone,
    dob: req.body.dob,
    course: req.body.course,
    exitexam: req.body.exitexam,
    qualification: req.body.qualification,
    specialization: req.body.specialization,
    address: req.body.address,
    ClassX_Course: req.body.ClassX_Course,
    ClassX_Board: req.body.ClassX_Board,
    ClassX_Percentage: req.body.ClassX_Percentage,
    ClassX_YrOfPassing: req.body.ClassX_YrOfPassing,
    ClassXII_Course: req.body.ClassXII_Course,
    ClassXII_Board: req.body.ClassXII_Board,
    ClassXII_Percentage: req.body.ClassXII_Percentage,
    ClassXII_YrOfPassing: req.body.ClassXII_YrOfPassing,
    Graduation_Course: req.body.Graduation_Course,
    Graduation_University: req.body.Graduation_University,
    Graduation_Percentage: req.body.Graduation_Percentage,
    Graduation_YrOfPassing: req.body.Graduation_YrOfPassing,
    Masters_Course: req.body.Masters_Course,
    Masters_University: req.body.Masters_University,
    Masters_Percentage: req.body.Masters_Percentage,
    Masters_YrOfPassing: req.body.Masters_Percentage,
    relocate: req.body.relocate,
    password: req.body.password,
    jobtype: req.body.jobtype,
    passoutyear: req.body.passoutyear,
    skillSet: req.body.skillSet,
    profilePic: req.files.file1[0].filename,
    resume: req.files.file2[0].filename,
  };
  var student = new StudentData(student);
  student.save();
});

// Route for updating Personnel details of a student
router.put("/updatepersonnel", verifyToken, async (req, res) => {
  (id = req.body._id),
    (address = req.body.address),
    (phone = req.body.phone),
    await StudentData.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          address: address,
          phone: phone,
        },
      }
    ).then(function () {
      res.send();
    });
});

// Route to get the Profile of a particular student
router.get("/profile/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  StudentData.findOne({ _id: id }).then((student) => {
    res.send(student);
  });
});

router.get("/getJobs", verifyToken, (req, res) => {
  JobData.find().then((jobs) => {
    res.send(jobs);
  });
});
router.get("/", (req, res) => {
  StudentData.find().then((students) => {
    res.send(students);
  });
});

// checking whether student is a registered user
router.get("/studentsignup/:regstu", async (req, res) => {
  const regstuEmail = req.params.regstu;
  var flag = false;

  const regStu = await registeredMail.findOne({ email: regstuEmail });

  if (!regStu) {
    flag = false;
    return res
      .status(200)
      .json({ msg: "Not a registered student of ICTAK", flag });
  } else {
    const onceRegStu = await StudentData.findOne({ email: regstuEmail });
    if (!onceRegStu) {
      flag = true;
      return res
        .status(200)
        .json({ msg: "You can proceed to registration form", flag });
    } else {
      flag = false;
      res.status(200).json({ msg: "You can register only once", flag });
    }
  }
});

router.put("/updateacademic", verifyToken, async (req, res) => {
  (id = req.body._id),
    (qualification = req.body.qualification),
    (specialization = req.body.specialization),
    (passoutyear = req.body.passoutyear),
    await StudentData.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          qualification: qualification,
          specialization: specialization,
          passoutyear: passoutyear,
        },
      }
    ).then(function () {
      res.send();
    });
});

router.put("/updatepicres", uploadMultiple, async (req, res) => {
  (id = req.body.studentId),
    (profilePic = req.files.file1[0].filename),
    (resume = req.files.file2[0].filename),
    await StudentData.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          profilePic: profilePic,
          resume: resume,
        },
      }
    ).then(function () {
      res.send();
    });
});

router.post("/applied", verifyToken, (req, res) => {
  enteredjob = req.body;
  var flag = false;
  AppliedJobData.find().then((appliedjobsdata) => {
    for (let i = 0; i < appliedjobsdata.length; i++) {
      if (
        enteredjob.jobdata.jobId == appliedjobsdata[i].jobId &&
        enteredjob.studentid == appliedjobsdata[i].studentid
      ) {
        flag = true;
        console.log(flag);
        break;
      } else {
        flag = false;
      }
    }
    if (flag == true) {
      return res
        .status(200)
        .json({ msg: "Already Applied for this Post", flag });
    } else {
      var appliedjob = new AppliedJobData({
        studentid: req.body.studentid,
        employerGenId: req.body.jobdata.employerGenId,
        designation: req.body.jobdata.designation,
        passoutyear: req.body.jobdata.passoutyear,
        skills: req.body.jobdata.skills,
        ictakcourse: req.body.jobdata.ictakcourse,
        vaccancies: req.body.jobdata.vaccancies,
        salary: req.body.jobdata.salary,
        intern: req.body.jobdata.intern,
        jobId: req.body.jobdata.jobId,
        experience: req.body.jobdata.experience,
        postedDate: req.body.jobdata.postedDate,
        lastDate: req.body.jobdata.lastDate,
      });
      var appliedjob = new AppliedJobData(appliedjob);
      appliedjob.save().then(() => {
        res
          .status(200)
          .json({ msg: "Successfully applied for the Post ", flag });
      });
    }
  });
});

router.get("/getjobscount", (req, res) => {
  JobData.find()
    .countDocuments()
    .then((data) => {
      res.status(200).json(data);
    });
});

router.get("/getappliedjobscount/:studentid", (req, res) => {
  stuid = req.params.studentid;
  AppliedJobData.find({ studentid: stuid })
    .countDocuments()
    .then((data) => {
      res.status(200).json(data);
    });
});
router.get("/getappliedjobs/:studentid", (req, res) => {
  stuid = req.params.studentid;

  AppliedJobData.find({ studentid: stuid }).then((jobs) => {
    res.send(jobs);
  });
});

router.put("/updateskill", verifyToken, async (req, res) => {
  (id = req.body._id), console.log(id);
  (skillSet = req.body.skillSet),
    await StudentData.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          skillSet: skillSet,
        },
      }
    ).then(function () {
      res.send();
    });
});

module.exports = router;
