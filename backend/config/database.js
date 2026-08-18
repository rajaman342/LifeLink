const mongoose = require("mongoose");

const connectDb = async () => {
  try {

   
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongo db connected");
  } catch (err) {
    console.log(err.message);
    console.log("connection failed");
    process.exit(1);
  }
};
module.exports = connectDb;
