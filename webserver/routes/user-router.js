"use strict";

const express = require("express");
const multer = require("multer"); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

const checkJwtToken = require("../controllers/session/check-jwt-token");
const getUserCapacity = require("../controllers/user/get-user-capacity");
const getUserProfile = require("../controllers/user/get-user-profile");
const updateUserProfile = require("../controllers/user/update-user-profile");
const updateUserCapacity = require("../controllers/user/update-user-capacity");
const uploadAvatar = require("../controllers/user/upload-avatar");

const upload = multer();
/**
 * Activamos a multer.
 *
 * Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
 *
 */

const router = express.Router();

router.get("/user", checkJwtToken, getUserProfile);
router.put("/user", checkJwtToken, updateUserProfile);
router.post(
  "/user/avatar",
  checkJwtToken,
  upload.single("avatar"),
  uploadAvatar
); // En este caso ponemos single porque solamente se subirá una imagen.
router.get("/user/capacity", checkJwtToken, getUserCapacity);
router.put("/user/capacity", checkJwtToken, updateUserCapacity);

module.exports = router;
