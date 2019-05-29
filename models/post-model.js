"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  content: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: Date
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
