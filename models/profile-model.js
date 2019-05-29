"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const profileSchema = new Schema({
  uuid: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  createdAt: Date
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
