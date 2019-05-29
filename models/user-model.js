"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  uuid: {
    type: String,
    unique: true
  },
  avatarUrl: String,
  fullName: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;
