const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURI);
    console.log("Database Connected");
  } catch (error) {
    console.log(`${error.message}`);
  }
};

module.exports = connectdb;
