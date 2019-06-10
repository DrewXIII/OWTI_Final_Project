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

  /**
   * Esto es igual a:
   *
   * const q = req.query.q;
   *
   * Significa que guardamos en la variable 'q' lo que nos viene del frontend.
   *
   */

  try {
    await validate({ q });
  } catch (e) {
    return res.status(400).send(e); // 400 Bad Request - HTTP
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * 2. Buscamos en Mongo DB el valor de 'q'.
   *
   * Para ello utilizamos mongoose y la función será find(CONDICIÓN,b).
   *
   */

  /**
   * Esta sería la condición:
   */

  const op = {
    $text: {
      $search: q
    }
  };

  /**
 * $text performs a text search on the content of the fields indexed with a text index. A $text expression has the following syntax:
 * 
 * {
    $text:
      {
        $search: <string> ==> A string of terms that MongoDB parses and uses to query the text index. MongoDB performs a logical OR search of the terms unless specified as a phrase.
      }
    } 
 * 
 */

  // const scoreSearch = {
  //   score: {
  //     $meta: "textScore"
  //   }
  // };

  /**
   * The { $meta: "textScore" } expression provides information on the processing of the $text operation.
   *
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

  /**
   * Básicamente lo que se va a hacer es buscar lo que viene del frontend (la 'q'). A esta búsqueda se le asignará una precisión a lo puesto en el campo de búsqueda y se ordenarán los resultados según esa precisión. Esto es lo que hace scoreSeach.
   *
   *
   */

  try {
    // const users = await UserModel.find(op, scoreSearch)
    //   .sort(scoreSearch)
    //   .lean();

    const users = await UserModel.find({
      fullName: { $regex: `${q}`, $options: "i" }
    }).lean();
    console.log({ users });
    /**
     * Enabling the lean option tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO.
     *
     * Con lean() haré que se me devuelva un objeto en formato Javascript y no propio de Mongo DB.
     */

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
