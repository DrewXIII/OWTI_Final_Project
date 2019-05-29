"use strict";

const express = require("express");
const multer = require("multer"); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

const checkJwtToken = require("../controllers/session/check-jwt-token");
const getUserProfile = require("../controllers/user/get-user-profile");
const getUserWall = require("../controllers/user/get-user-wall");
const searchUsers = require("../controllers/user/search-users");

const upload = multer();

const router = express.Router();

router.get("/user", checkJwtToken, getUserProfile);
router.get("/user/wall", checkJwtToken, getUserWall);
router.get("/user/search", checkJwtToken, searchUsers);

module.exports = router;
