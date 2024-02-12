const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1/relation")
  .then(() => {
    console.log("Server has connect to MongoDB");
  })
  .catch((err) => {
    console.log(`Kesalahan lu disini anjing :v = ${err}`);
  });

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ["Winter", "Fall", "Summer", "Spring"],
  },
});

const farmSchema = new mongoose.Schema({
  farm: String,
  address: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Farm = mongoose.model("Farm", farmSchema);
const Product = mongoose.model("Product", productSchema);

// const newFarm = async () => {
//   const farm = new Farm({
//     farm: "StarFarm",
//     address: "Bayern",
//   });
//   const banana = await Product.findOne({ name: "Banana" });
//   farm.products.push(banana);
//   await farm.save();
//   console.log(farm);
// };

// newFarm();

// Product.insertMany([
//   {
//     name: "Melon",
//     price: 8,
//     season: "Summer",
//   },
//   {
//     name: "Banana",
//     price: 7,
//     season: "Summer",
//   },
//   {
//     name: "Grape",
//     price: 10,
//     season: "Spring",
//   },
// ]);

// const newProduct = async (id) => {
//   const farm = await Farm.findById(id);
//   const melon = await Product.findOne({ name: "Melon" });
//   farm.products.push(melon);
//   await farm.save();
//   console.log(farm);
// };

// newProduct("65c1cdc64cc39b293af8335c");

Farm.findOne({ farm: "StarFarm" })
  .populate("products")
  .then((farm) => {
    console.log(farm);
  });
