"use strict";

const Joi = require("@hapi/joi");
const UserModel = require("../../../models/user-model");

async function validate(payload) {
  const schema = {
    q: Joi.string()
      .min(3)
      .max(128)
      .required()
  };

  return Joi.validate(payload, schema);
}

async function searchUsers(req, res, next) {
  const { q } = req.query;

  try {
    await validate({ q });
  } catch (e) {
    return res.status(400).send(e);
  }

  const op = {
    $text: {
      $search: q
    }
  };

  const scoreSearch = {
    score: {
      $meta: "textScore"
    }
  };
}
