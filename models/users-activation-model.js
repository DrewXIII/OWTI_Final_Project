"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersActivationSchema = new Schema({
  verificationCode: {
    type: String,
    unique: true
  },
  userId: String,
  verifiedAt: Date,
  createdAt: Date
});

const UsersActivation = mongoose.model(
  "UsersActivation",
  usersActivationSchema
);

module.exports = UsersActivation;
