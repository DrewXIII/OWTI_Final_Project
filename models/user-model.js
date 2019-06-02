"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  uuid: {
    type: String,
    unique: true
  },
  avatarUrl: String,
  fullName: String,
  address: {
    addressLocality: String,
    addressRegion: String,
    postalCode: Number,
    streetAddress: String
  },
  preferences: {
    twitter: String,
    instagram: String,
    facebook: String,
    web: String,
    description: String
  },
  contact: {
    email: String,
    phoneNumber: Number
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
