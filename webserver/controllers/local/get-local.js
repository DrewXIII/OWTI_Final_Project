"use strict";

const UserModel = require("../../../models/user-model");

async function getLocal(req, res, next) {
  const { fullName } = req;

  /**
   * Esto es lo mismo que const fullName = req.fullName
   *
   */

  /**
   * Escribo las condiciones para buscar el perfil de usuario.
   */

  /**
   * Con esto hago que lo que me devulva Mongo DB no tenga el 'id' ni el 'v' (que por defecto los pone a cada nuevo elemento que se mete).
   */
  const projection = {
    _id: 0,
    __v: 0
  };

  /**
   *
   * Y ahora busco el perfil de ese usuario con su uuid y con esa condición de que me lo devuelva sin el 'id' ni la 'v'.
   *
   * Collection Methods:
   *
   * findOne(query, projection) => Returns one document that satisfies the specified query criteria on the collection or view. If multiple documents satisfy the query, this method returns the first document according to the natural order which reflects the order of documents on the disk. In capped collections, natural order is the same as insertion order. If no document satisfies the query, the method returns null.
   *
   */
  const localProfile = await UserModel.findOne(fullName, projection);

  return res.status(200).send(localProfile); // 200 OK - HTTP
}

module.exports = getLocal;
