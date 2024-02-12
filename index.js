const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const ErrorHandling = require("./error/ErrorHandling");
const wrapAsync = require("./middleware/wrapAsync");

const Student = require("./models/studentModel");
const Lecture = require("./models/lectureModel");

mongoose
  .connect("mongodb://127.0.0.1/college")
  .then(() => {
    console.log("Server has connect to MongoDB");
  })
  .catch((err) => {
    console.log(`Kesalahan lu disini anjing :v = ${err}`);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: "keyboard-cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.flash_messages = req.flash("flash_messages");
  next();
});

// Penggunaan Middleware sebagai Auth
const auth = (req, res, next) => {
  const { password } = req.query;
  if (password === "admin") {
    next();
  }
  throw new ErrorHandling("Butuh password bro", 401);
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/admin", auth, (req, res) => {
  res.send("Welcome to Admin Page");
});

app.get("/error", (req, res) => {
  bird.fly();
});

app.get("/error/general", (req, res) => {
  throw new ErrorHandling();
});

app.get(
  "/lectures",
  wrapAsync(async (req, res) => {
    const lectures = await Lecture.find({});
    res.render("lecture/index", { lectures });
  })
);

app.get("/lectures/create", (req, res) => {
  res.render("lecture/create");
});

app.post(
  "/lectures",
  wrapAsync(async (req, res) => {
    const lecture = new Lecture(req.body);
    await lecture.save();
    req.flash("flash_messages", "Data baru berhasil ditambahkan");
    res.redirect("/lectures");
  })
);

app.get(
  "/lectures/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const lecture = await Lecture.findById(id).populate("students");
    res.render("lecture/detail", { lecture });
  })
);

app.get("/lectures/:lecture_id/students/create", (req, res) => {
  const { lecture_id } = req.params;
  res.render("students/create", { lecture_id });
});

app.post(
  "/lectures/:lecture_id/students",
  wrapAsync(async (req, res) => {
    const { lecture_id } = req.params;
    const lecture = await Lecture.findById(lecture_id);
    const student = new Student(req.body);
    lecture.students.push(student);
    student.lecture = lecture;
    await lecture.save();
    await student.save();
    res.redirect(`/lectures/${lecture_id}`);
  })
);

app.delete(
  "/lectures/:lecture_id/",
  wrapAsync(async (req, res) => {
    const { lecture_id } = req.params;
    await Lecture.findOneAndDelete({ _id: lecture_id });
    res.redirect("/lectures");
  })
);

app.get(
  "/students",
  wrapAsync(async (req, res) => {
    const { gender } = req.query;
    if (gender) {
      const students = await Student.find({ gender: gender });
      res.render("students/index.ejs", { students, gender });
    } else {
      const students = await Student.find({});
      res.render("students/index.ejs", { students, gender: "All" });
    }
  })
);

app.get("/students/create", (req, res) => {
  res.render("students/create.ejs");
});

app.post("/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(200).redirect(`/students/${student._id}`);
});

app.get(
  "/students/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id).populate("lecture");
    res.status(200).render("students/detail", { student });
  })
);

app.get("/students/:id/edit", async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id);
  res.status(200).render("students/edit", { student });
});

app.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });
  res.status(200).redirect(`/students/${student._id}`);
});

app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.status(200).redirect("/students");
});

// app.use((err, req, res, next) => {
//   console.log("===============");
//   console.log("=====ERROR=====");
//   console.log("===============");
//   next(err);
// });

const validatorHandler = (err) => {
  err.status = 400;
  err.message = Object.values(err.errors).map((item) => item.message);
  return new ErrorHandling(err.message, err.status);
};

app.use((err, req, res, next) => {
  console.dir(err);
  if ((err.name = "ValidationError")) (err) => validatorHandler(err);
  if ((err.name = "CastError")) {
    err.status = 404;
    err.message = "Data not found";
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3000, () => {
  console.log(`Server has running on http://127.0.0.1:3000`);
});
