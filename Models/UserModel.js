const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const user = new mongoose.Schema({
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
});

module.exports = mongoose.model("Useer", user);
