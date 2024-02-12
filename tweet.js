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
  username: String,
  age: Number,
});

const tweetSchema = new mongoose.Schema({
  text: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const User = mongoose.model("User", userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);

const makeTweet = async () => {
  const user = await User.findOne({
    username: "Gumball",
  });
  const tweet = new Tweet({
    text: "Hi guys, gimana kabar lo semua?",
    likes: 0,
  });
  tweet.user = user;
  //   tweet.save();
};

makeTweet();

const showTweet = async (id) => {
  const tweet = await Tweet.findById(id).populate("user");
  console.log(tweet);
};

showTweet("65c208795398844d60466311");
