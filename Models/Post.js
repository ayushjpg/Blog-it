const { timeStamp } = require("console");
const mongoose = require("mongoose");

const post = mongoose.Schema(
  {
    Owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Useer",
    },
    Title: {
      type: String,
    },
    Content: {
      type: String,
    },
    Tag: {
      type: String,
    },
    image: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Post", post);
