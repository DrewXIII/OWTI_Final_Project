"use strict";

const Joi = require("joi");
const UserModel = require("../../../models/user-model");
const UserCapacityModel = require("../../../models/user-capacity-model");

async function validate(payload) {
  const schema = {
    fullName: Joi.string()
      .min(3)
      .max(128)
      .required()
  };

  return Joi.validate(payload, schema);
}

async function searchLocalId(req, res, next) {
  const { fullName } = req.params;

  try {
    await validate({ fullName });
  } catch (e) {
    return res.status(400).send(e); // 400 Bad Request - HTTP
  }

  const projection = {
    _id: 0,
    __v: 0
  };

  try {
    const userProfile = await UserModel.findOne({ fullName }, projection);
    if (!userProfile) res.status(404).send({});
    const userCapacityProfile = await UserCapacityModel.findOne(
      { uuid: userProfile.uuid },
      projection
    );
    const result = { userProfile, userCapacityProfile };
    return res.status(200).send(result); // 200 OK - HTTP
  } catch (err) {
    return res.status(500).send(err.message); // 500 Internal Server Error - HTT
  }
}

module.exports = searchLocalId;
