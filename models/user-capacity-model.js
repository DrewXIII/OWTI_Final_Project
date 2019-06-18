"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const capacitySchema = new Schema({
  uuid: {
    type: String,
    unique: true
  },
  capacity: Number
});

const Capacity = mongoose.model("Capacity", capacitySchema);

module.exports = Capacity;
