const mongoose = require("mongoose");

const Student = require("./studentModel");

const lectureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama tidak boleh kosong"],
  },
  age: {
    type: Number,
    required: [true, "Umur tidak boleh kosong"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: [true, "Gender lu harus jelas gblk"],
  },
  address: {
    type: String,
    required: [true, "Alamat harus diketahui"],
  },
  course: {
    type: String,
    required: [true, "Mata Kuliah tidak boleh kosong"],
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

lectureSchema.post("findOneAndDelete", async function (lecture) {
  if (lecture.students.length) {
    const res = await Student.deleteMany({ _id: { $in: lecture.students } });
    console.log(res);
  }
});

const Lecture = mongoose.model("Lecture", lectureSchema);

module.exports = Lecture;
