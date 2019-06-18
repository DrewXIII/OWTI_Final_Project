"use strict";

const dot = require("dot-object"); // Dot-Object makes it possible to transform javascript objects using dot notation.
const Joi = require("joi"); // Object schema description language and validator for JavaScript objects.

const UserModel = require("../../../models/user-model");

async function validate(payload) {
  const schema = {
    fullName: Joi.string()
      .min(3)
      .max(128)
      .allow(null),
    details: Joi.object().keys({
      maxCapacity: Joi.number().allow(null),
      openingHours: Joi.string()
        .min(3)
        .max(128)
        .allow(null)
    }),
    address: Joi.object().keys({
      addressLocality: Joi.string()
        .min(3)
        .max(128)
        .allow(null),
      addressRegion: Joi.string()
        .min(3)
        .max(128)
        .allow(null),
      postalCode: Joi.string()
        .min(3)
        .max(128)
        .allow(null),
      streetAddress: Joi.string()
        .min(3)
        .max(128)
        .allow(null)
    }),
    preferences: Joi.object().keys({
      twitter: Joi.string().allow(null),
      instagram: Joi.string().allow(null),
      facebook: Joi.string().allow(null),
      web: Joi.string().allow(null),
      description: Joi.string().allow(null)
    }),
    contact: Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .allow(null),
      phoneNumber: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .allow(null)
    })
  };

  return Joi.validate(payload, schema);
}

async function updateUserProfile(req, res, next) {
  const userDataProfile = { ...req.body };
  const { claims } = req; // Esto es igual a const claims = req.claims;

  try {
    await validate(userDataProfile);
  } catch (e) {
    return res.status(400).send(e); // 400 Bad Request - HTTP
  }

  try {
    const userDataProfileMongoose = dot.dot(userDataProfile);
    const data = await UserModel.updateOne(
      { uuid: claims.uuid },
      userDataProfileMongoose
    );
    console.log("mongoose data", data);
    return res.status(204).send(); // 204 No Content - HTTP
  } catch (err) {
    return res.status(500).send(err.message); // 500 Internal Server Error - HTTP
  }
}

module.exports = updateUserProfile;
