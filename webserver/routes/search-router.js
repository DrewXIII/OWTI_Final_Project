"use strict";

const express = require("express");

const searchLocal = require("../controllers/search/search-local");

const router = express.Router();

router.post("/search", searchLocal);

module.exports = router;
