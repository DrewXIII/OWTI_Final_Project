"use strict";

const UserActivation = require("../../../models/user-activation-model");

async function activate(req, res, next) {
  const { verification_code: verificationCode } = req.query;

  if (!verificationCode) {
    return res.status(400).json({
      message: "invalid verification code",
      target: "verification_code"
    }); // 400 Bad Request - HTTP
  }

  try {
    const now = new Date();
    const query = { verificationCode };
    await UserActivation.findOneAndUpdate(query, { verifiedAt: now });
    return res.status(200).send("Activated"); // 200 OK - HTTP
  } catch (e) {
    return res.status(500).send(e.message); // 500 INTERVAL SERVER ERROR - HTTP
  }
}

module.exports = activate;
