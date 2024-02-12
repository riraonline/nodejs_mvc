const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1/relation")
  .then(() => {
    console.log("Server has connect to MongoDB");
  })
  .catch((err) => {
    console.log(`Kesalahan lu disini anjing :v = ${err}`);
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  address: [
    {
      _id: false,
      city: String,
      country: String,
      ideology: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

// const addUser = async () => {
//   const newUser = new User({
//     name: "John",
//   });
//   newUser.address.push({
//     city: "Aloha",
//     country: "USA",
//     ideology: "Liberal",
//   });

//   const res = await newUser.save();
//   console.log(res);
// };

// addUser();

const addAddress = async (id) => {
  const user = await User.findById(id);
  user.address.push({
    city: "Stalingard",
    country: "USSR",
    ideology: "Comunist",
  });
  const res = await user.save();
  console.log(res);
};

addAddress("65c1bc7c894fc676553c1d2e");
