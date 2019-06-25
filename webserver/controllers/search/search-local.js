"use strict";

const Joi = require("joi");
const UserModel = require("../../../models/user-model");

/**
 * Validate if search data is valid
 * @param {Object} payload Object to be validated. { q: String to search }
 * @return {Object} null if data is valid, throw an Error if data is not valid
 */
async function validate(payload) {
  const schema = {
    q: Joi.string()
      .min(3)
      .max(128)
      .required()
  };

  return Joi.validate(payload, schema);
}

async function searchLocal(req, res, next) {
  /**
   *
   * 1. Validamos que lo que viene del front es un string.
   *
   */

  const { q } = req.query;

  try {
    await validate({ q });
  } catch (e) {
    return res.status(400).send(e); // 400 Bad Request - HTTP
  }

  /**
   * 2. Buscamos en Mongo DB el valor de 'q'.
  
   */

  const op = {
    $text: {
      $search: q
    }
  };

  try {
    const users = await UserModel.find({
      fullName: { $regex: `${q}`, $options: "i" }
    }).lean();
    console.log({ users });

    /**
     *
     * Por último,
     */

    const usersMinimumInfo = users.map(userResult => {
      const { fullName, score } = userResult;

      return {
        fullName,
        score
      };
    });

    return res.send(usersMinimumInfo);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = searchLocal;
