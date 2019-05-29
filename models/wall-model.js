"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const wallSchema = new Schema({
  uuid: {
    type: String,
    unique: true
  },
  post: String
});

const Wall = mongoose.model("Wall", wallSchema);

module.exports = Wall;
