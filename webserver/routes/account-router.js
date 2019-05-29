"use strict";

const express = require("express");

const activateAccount = require("../controllers/account/activate-account");
const createAccount = require("../controllers/create-account-controller");
const login = require("../controllers/login-controller");

// Creo las rutas para cada endpoint.

const router = express.Router();

router.post("/account", createAccount);
router.post("/account/login", login);
router.get("/account/activate", activateAccount);

module.exports = router;
