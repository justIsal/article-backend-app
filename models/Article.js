const mongoose = require("mongoose");
const commentSchema = require("./Comment");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const CommentsSchema = new mongoose.Schema({
  commentValues: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }
});
const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  imgUrl: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["publish", "draft", "no-publish"],
  },
  content: {
    type: String,
    required: true,
  },
  tag: {
    type: [String],
    required: true,
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return dateRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid date! Use YYYY-MM-DD format.`,
    },
  },
  comments: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
  }], 
});

module.exports = mongoose.model("Article", TodoSchema);
