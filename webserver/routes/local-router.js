"use strict";

const express = require("express");

const getLocal = require("../controllers/local/get-local");

const router = express.Router();

router.get("/local", getLocal);

module.exports = router;
