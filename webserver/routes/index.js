"use strict";

const accountRouter = require("./account-router");
const localRouter = require("./local-router");
const searchRouter = require("./search-router");
const userRouter = require("./user-router");

module.exports = {
  accountRouter,
  localRouter,
  searchRouter,
  userRouter
};
