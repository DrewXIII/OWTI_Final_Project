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
    postalCode: String,
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
    phoneNumber: String
  }
});

userSchema.index({
  fullName: "text",
  "preferences.twitter": "text",
  "preferences.instagram": "text",
  "preferences.facebook": "text",
  "preferences.web": "text"
});

const User = mongoose.model("User", userSchema);

module.exports = User;
