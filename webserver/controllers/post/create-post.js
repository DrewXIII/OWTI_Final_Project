"use strict";

const Joi = require("joi"); // Object schema description language and validator for JavaScript objects.
const PostModel = require("../../../models/post-model");
const WallModel = require("../../../models/wall-model");

async function validate(payload) {
  const schema = {
    content: Joi.number()
      .integer()
      .min(0)
  };

  return Joi.validate(payload, schema);
}

async function createPost(req, res, next) {
  /**
   * Lo que viene a continuación quiere decir lo siguiente:
   * 1. Copiamos lo que viene en la req.body (viene en body porque es un POST).
   * 2. Esto const { claims } = req; es lo mismo que const claims = req.claims; y con esto queremos hacer lo siguiente:
   *    Dado que para crear un post hay que estar registrado y logueado, esto implica que tienes asociado el JWT al entrar, por lo tanto tienes un rol y un uuid.
   * 
   *  req.claims = {
      uuid: decoded.uuid,
      role: decoded.role,
    };

    Por lo tanto, primero compiamos el req.claims y lo guardamos en una variable 'claims' y a continuacuón cogemos el uuid del usuario logueado y lo guardamos en una variable 'uuid'. Necesitamos el uuid de la persona logueada para poder actualizar su tabla de datos correspondiente cuando cree un post nuevo.
   */
  const postData = { ...req.body }; // Esto quiere decir que se copia todo lo de req.body
  const { claims } = req; // Esto es lo mismo que const claims = req.claims;
  const { uuid } = claims; // Esto es lo mismo que const uuid = claims.uuid;

  /**
   * Ahora se comprueba que lo que viene en la req es válido (lo que viene es postData).
   */
  try {
    await validate(postData);
  } catch (e) {
    return res.status(400).send(e); // 400 Bad Request - HTTP
  }

  /**
   * Siendo la información recibida válida, procedemos a guardarla en Mongo DB.
   * Creamos la variable en la cual se va a guardar la información (es con el esquema que luego se va a guardar esa información en Mongo DB).
   */
  const data = {
    owner: uuid,
    author: uuid,
    content: postData.content,
    deletedAt: null
  };

  /**
   * Y ahora guardamos esta req siguiendo el esquema de PostModel y guardándola en dicha tabla => posts
   */
  try {
    const postCreated = await PostModel.create(data);
    // Ahora preparamos las variables de la función findOneAndUpdate(filter, operation)
    const filter = {
      uuid
    };

    /**
     * $addToSet =>	Adds elements to an array only if they do not already exist in the set.
     */
    const operation = {
      $addToSet: {
        posts: postCreated._id
      }
    };

    await WallModel.findOneAndReplace(filter, operation);

    return res.status(201).send(postCreated); // 201 Created - HTTP
  } catch (e) {
    res.status(500).send(e.message); // 500 Internal Server Error - HTTP
  }
}

module.exports = createPost;
