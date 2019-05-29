"use strict";

const cloudinary = require("cloudinary");
const UserModel = require("../../../models/user-model");

cloudinary.config({
  cloud_name: process.env.CLOUDINARI_CLOUD_NAME,
  api_key: process.env.CLOUDINARI_API_KEY,
  api_secret: process.env.CLOUDINARI_API_SECRET
});

async function uploadAvatar(req, res, next) {
  const { file } = req; // Esto sería lo mismo que const uuid = req.file;
  const { uuid } = req.claims; // Esto sería lo mismo que const uuid = req.claims.uuid;

  if (!file || !file.buffer) {
    return res.status(400).send("The file does not exist"); // 400 Bad Request - HTTP
  }

  cloudinary.v2.upload_stream(
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
        return res.status(400).send(err);
      }

      const { etag, secure_url: secure_url } = result;

      const filter = {
          uuid
      };

      const operation = {
          avatarUrl = secure_url
      };

      try {
          await UserModel.updateOne(filter, operation);
      }catch (e) {
          return res.status(500).send(e.message);
      }

      res.header('Location', secureUrl);
      res.status(201).send();
    }).end(file.buffer);
}

module.exports = uploadAvatar;
