"use strict";

const UserCapacityModel = require("../../../models/user-capacity-model");
const UserModel = require("../../../models/user-model");

async function getUserCapacityPercent(fullName) {
  const projection = {
    _id: 0,
    avatarUrl: 0,
    address: 0,
    preferences: 0,
    contact: 0,
    __v: 0
  };

  const projection2 = {
    _id: 0,
    __v: 0
  };

  const { details, uuid } = await UserModel.findOne({ fullName }, projection);

  const { maxCapacity: userMaxCapacity } = details;

  const { capacity: userCurrentCapacity } = await UserCapacityModel.findOne(
    { uuid },
    projection2
  );
  const result = (userCurrentCapacity * 100) / userMaxCapacity;

  return result;
}

module.exports = getUserCapacityPercent;
