"use strict";

const cloudinary = require("cloudinary");

/**
 * Cloudinary is a cloud service that offers a solution to a web application's entire image management pipeline.

Easily upload images to the cloud. Automatically perform smart image resizing, cropping and conversion without installing any complex software. Integrate Facebook or Twitter profile image extraction in a snap, in any dimension and style to match your website’s graphics requirements. Images are seamlessly delivered through a fast CDN, and much much more.

Cloudinary offers comprehensive APIs and administration capabilities and is easy to integrate with any web application, existing or new.

Cloudinary provides URL and HTTP based APIs that can be easily integrated with any Web development framework.

For Node.js, Cloudinary provides an extension for simplifying the integration even further.
 */

const UserModel = require("../../../models/user-model");

/**
 * Configuración de cloudinary:
 *
 * Each request for building a URL of a remote cloud resource must have the cloud_name parameter set. Each request to our secure APIs (e.g., image uploads, eager sprite generation) must have the api_key and api_secret parameters set.
 *
 * Setting the cloud_name, api_key and api_secret parameters can be done either directly in each call to a Cloudinary method, by calling the cloudinary.config(), or by using the CLOUDINARY_URL environment variable.
 *
 * Para este caso se ha decidido usar CLOUDINARY_URL environment variable.
 */

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

  /**
   * Esto es igual a:
   *
   * const file = req.file;
   * const uuid = req.claims.uuid;
   *
   * Esto significa que se copia todo lo que viene en req.file y se guarda en esa variable. Este objeto trae lo siguiente:
   *
   * { claims:
   *    { uuid: '56fbdc13-9a45-4f25-80a4-4c0aecc9c077', role: 'admin' } }
   *
   * El uuid es el uuid del usuario que esta logueado y, por lo tanto, está modificando el campo del aforo.
   */

  if (!file || !file.buffer) {
    return res.status(400).send("The file does not exist"); // 400 Bad Request
  }

  /**
   * 2. Ahora, siguiendo las instrucciones de la librería de cloudinary, creamos la función que nos permite subir una imagen a nuestra base de datos.
   * Añadir upload_stream sirve para:
   *
   * 'You can use cloudinary.upload_stream to write to the uploader as a stream'
   *
   * Lo que significa que
   *
   * El formato de la función es el siguiente:
   *
   * cloudinary.v2.uploader.upload_stream(IMAGEN, FUNCIÓN DE SUBIDA DE LA IMAGEN);
   *
   * Se añade .end() al final porque:
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

        /**
         * Esto es lo mismo que:
         *
         * const secureUrl = result.secure_url;
         *
         * Esto es una de las cosas que nos manda cloudinary, y particularmente, esta la guardamos porque nos interesa para poder guardar nuestras imágenes.
         *
         */

        const filter = {
          uuid
        };

        const operation = {
          avatarUrl: secureUrl
        };

        /**
         * A continuación utilizamos la función de mongoose para subir la imagen mediante ese filtro de búsqueda y esa condición. La función va a buscar el uuid correspondiente y va a actualizar su avatarUrl con el string de la nueva imagen.
         *
         */

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
