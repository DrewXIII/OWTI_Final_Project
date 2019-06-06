"use strict";

const dot = require("dot-object"); // Dot-Object makes it possible to transform javascript objects using dot notation.
const Joi = require("joi"); // Object schema description language and validator for JavaScript objects.

const UserCapacityModel = require("../../../models/user-capacity-model");

async function validate(payload) {
  const schema = {
    capacity: Joi.number()
      .string()
      .min(0)
  };

  return Joi.validate(payload, schema);
}

async function updateUserCapacity(req, res, next) {
  const userCapacityData = { ...req.body };
  const { claims } = req; // Esto es igual a const claims = req.claims;

  try {
    await validate(userCapacityData);
  } catch (e) {
    return res.status(400).send(e); // 400 Bad Request - HTTP
  }

  try {
    const userCapacityDataMongoose = dot.dot(userCapacityData);
    const data = await UserCapacityModel.updateOne(
      { uuid: claims.uuid },
      userCapacityDataMongoose
    );
    console.log("mongoose data", data);
    return res.status(204).send(); // 204 No Content - HTTP
  } catch (err) {
    return res.status(500).send(err.message); // 500 Internal Server Error - HTTP
  }
}

module.exports = updateUserCapacity;
