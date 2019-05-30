"use strict";

const UserModel = require("../../../models/user-model");

async function getUserProfile(req, res, next) {
  const { uuid } = req.claims; // Esto es lo mismo que const uuid = req.claims.uuid

  /**
   *
   * Collection Methods:
   *
   * findOne(query, projection) => Returns one document that satisfies the specified query criteria on the collection or view. If multiple documents satisfy the query, this method returns the first document according to the natural order which reflects the order of documents on the disk. In capped collections, natural order is the same as insertion order. If no document satisfies the query, the method returns null.
   *
   */

  const projection = {
    _id: 0,
    __v: 0
  };

  const userProfile = await UserModel.findOne({ uuid }, projection);

  return res.status(200).send(userProfile); // 200 OK - HTTP
}

module.exports = getUserProfile;
