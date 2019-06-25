"use strict";

const cloudinary = require("cloudinary");

const UserModel = require("../../../models/user-model");

cloudinary.config({
  cloud_name: process.env.CLOUDINARI_CLOUD_NAME,
  api_key: process.env.CLOUDINARI_API_KEY,
  api_secret: process.env.CLOUDINARI_API_SECRET
});

async function uploadAvatar(req, res, next) {
  /**
   * 1. Guardamos todo lo que viene de la petición de frontend que nos pueda interesar, en este caso, la imagen (que vendrá en forma de string).
   *
   */

  const { file } = req;

  const { uuid } = req.claims;

  console.log(req.file);

  if (!file || !file.buffer) {
    return res.status(400).send("The file does not exist"); // 400 Bad Request
  }

  /**
   * 2. Ahora, siguiendo las instrucciones de la librería de cloudinary, creamos la función que nos permite subir una imagen a nuestra base de datos.
   *
   *
   */

  cloudinary.v2.uploader
    .upload_stream(
      {
        resource_type: "raw",
        public_id: uuid,
        width: 200,
        height: 200,
        format: "jpg",
        crop: "limit"
      },
      async (err, result) => {
        if (err) {
          return res.status(400).send(err); // 400 Bad Request - HTTP
        }

        const { secure_url: secureUrl } = result;

        const filter = {
          uuid
        };

        const operation = {
          avatarUrl: secureUrl
        };

        try {
          await UserModel.updateOne(filter, operation);
        } catch (e) {
          return res.status(500).send(e.message); // 500 Internal Server Error - HTTP
        }

        res.header("Location", secureUrl);
        res.status(201).send(); // 201 Created - HTTP
      }
    )
    .end(file.buffer);
}

module.exports = uploadAvatar;
