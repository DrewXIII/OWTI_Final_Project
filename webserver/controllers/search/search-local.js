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
  const { q } = req.query;

  try {
    await validate({ q });
  } catch (e) {
    return res.status(400).send(e);
  }

  /**
 * $text performs a text search on the content of the fields indexed with a text index. A $text expression has the following syntax:
 * 
 * {
  $text:
    {
      $search: <string>, ==> A string of terms that MongoDB parses and uses to query the text index. MongoDB performs a logical OR search of the terms unless specified as a phrase.
      $language: <string>,
      $caseSensitive: <boolean>,
      $diacriticSensitive: <boolean>
    }
}
 * 
 */

  const op = {
    $text: {
      $search: q
    }
  };

  /**
   * The $meta projection operator returns for each matching document the metadata (e.g. "textScore") associated with the query. A $meta expression has the following syntax:
   *
   *
   * { $meta: <metaDataKeyword> }
   *
   *
   * The $meta expression can specify the following keyword as the <metaDataKeyword>:
   *
   *
   * "textScore" ==> Returns the score associated with the corresponding $text query for each matching document. The text score signifies how well the document matched the search term or terms. If not used in conjunction with a $text query, returns a score of 0.
   *
   *
   *
   * The $meta expression can be a part of the projection document as well as a sort() expression as:
   *
   * { <projectedFieldName>: { $meta: "textScore" } }
   */

  const scoreSearch = {
    score: {
      $meta: "textScore"
    }
  };
  try {
    const users = await UserModel.find(op, scoreSearch)
      .sort(scoreSearch)
      .lean();

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
