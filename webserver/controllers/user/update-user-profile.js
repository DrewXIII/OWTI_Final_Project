"use strict";

const dot = require("dot-object"); // Dot-Object makes it possible to transform javascript objects using dot notation.
const Joi = require("joi"); // Object schema description language and validator for JavaScript objects.
const JoiPhoneNumber = require("google-libphonenumber");

const UserModel = require("../../../models/user-model");

async function validate(payload) {
  const schema = {
    fullName: Joi.string()
      .min(3)
      .max(128)
      .required(),
    address: Joi.object().keys({
      addressLocality: String,
      addressRegion: String,
      postalCode: Number,
      streetAddress: String
    }),
    preferences: Joi.object().keys({
      twitter: Joi.string().allow(null),
      instagram: Joi.string().allow(null),
      facebook: Joi.string().allow(null),
      web: Joi.string()
        .uri()
        .allow(null),
      description: Joi.string().allow(null)
    }),
    contact: Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
      phoneNumber: JoiPhoneNumber.string()
        .phoneNumber({ defaultCountry: "ES", format: "international" })
        .required()
    })
  };

  return Joi.validate(payload, schema);
}

async function updateUserProfile(req, res, next) {
  const userDataProfile = { ...req, body };
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
