"use strict";

const express = require("express");

const searchLocal = require("../controllers/search/search-local");
const searchLocalId = require("../controllers/search/search-local-id");

const router = express.Router();

router.get("/search", searchLocal);
router.get("/search/:fullName", searchLocalId);

module.exports = router;
