"use strict";

const UserCapacityModel = require("../../../models/user-capacity-model");

async function getUserCapacityProfile(req, res, next) {
  const { uuid } = req.claims;

  const projection = {
    _id: 0,
    __v: 0
  };

  const userCapacityProfile = await UserCapacityModel.findOne(
    { uuid },
    projection
  );

  return res.status(200).send(userCapacityProfile); // 200 OK - HTTP
}

module.exports = getUserCapacityProfile;
