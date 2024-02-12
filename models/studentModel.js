const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
  },
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
  major: {
    type: String,
    required: [true, "Jurusan tidak boleh kosong"],
  },
  university: {
    type: String,
    required: [true, "Nama Universitas tidak boleh kosong"],
  },
  lecture: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
