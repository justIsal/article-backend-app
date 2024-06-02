const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  valueComment: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  articleId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Article',
    required: true,
  },
});


module.exports = mongoose.model("Comment", commentSchema);