const bodyparser = require("body-parser");
const cors = require("cors");
const express = require("express");

const path = require("path");
const studentRoute = require("./routes/studentRoute");
const employerRoute = require("./routes/employerRoute");
const adminRoute = require("./routes/adminRoute");

const PORT = process.env.PORT || 3000;
const app = new express();

app.use(express.static("./dist/frontend"));

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/api/student", studentRoute);
app.use("/api/employer", employerRoute);
app.use("/api/main", adminRoute);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
