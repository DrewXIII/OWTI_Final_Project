"use strict";

const dot = require("dot-object"); // Dot-Object makes it possible to transform javascript objects using dot notation.
const Joi = require("joi"); // Object schema description language and validator for JavaScript objects.

const UserCapacityModel = require("../../../models/user-capacity-model");

/**
 * Función que utilizaremos en la función 'updateUserCapacity' para validar los datos entrantes que provienen del frontend.
 *
 */

async function validate(payload) {
  const schema = {
    capacity: Joi.number()
  };

  return Joi.validate(payload, schema);
}

async function updateUserCapacity(req, res, next) {
  /**
   * 1. Guardamos todo lo que viene de la petición de frontend que nos pueda interesar.
   */

  const userCapacityData = { ...req.body };

  /**
   * Esto significa que se copia todo lo que viene en req.body y se guarda en esa variable. Este objeto trae lo siguiente:
   *
   * { capacity: '13' }
   */

  const { claims } = req;

  /**
   * Esto es igual a const claims = req.claims;. Esto significa que se copia todo lo que viene en req.claims y se guarda en esa variable. Este objeto trae lo siguiente:
   *
   * { claims:
   *    { uuid: '56fbdc13-9a45-4f25-80a4-4c0aecc9c077', role: 'admin' } }
   *
   *
   * El uuid es el uuid del usuario que esta logueado y, por lo tanto, está modificando el campo del aforo.
   */

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * 2. Validamos que los datos introducidos sean válidos para poder guardarlos correctamente.
   *
   */
  try {
    await validate(userCapacityData);
  } catch (e) {
    return res.status(400).send(e); // 400 Bad Request - HTTP
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * 3. Guardamos los datos que vienen en la petición en la base de datos. En este caso queremos actualizar los existentes.
   *
   */

  try {
    const userCapacityDataMongoose = dot.dot(userCapacityData);

    const data = await UserCapacityModel.updateOne(
      { uuid: claims.uuid },
      userCapacityDataMongoose
    );

    console.log("mongoose data", data);

    return res.status(204).send(); // 204 No Content - HTTP
  } catch (err) {
    return res.status(500).send(err.message); // 500 Internal Server Error - HTTP
  }
}

module.exports = updateUserCapacity;
