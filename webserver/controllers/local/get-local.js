"use strict";

const UserModel = require("../../../models/user-model");

async function getLocal(req, res, next) {
  const { fullName } = req;

  const projection = {
    _id: 0,
    __v: 0
  };

  const localProfile = await UserModel.findOne(fullName, projection);

  return res.status(200).send(localProfile); // 200 OK - HTTP
}

module.exports = getLocal;
