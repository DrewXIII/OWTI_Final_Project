"use strict";

// En este archivo junto todas las rutas creadas para así exportarlas todas juntas.

const accountRouter = require("./account-router"); // Aquí está crear cuenta, activarla y hacer login, es decir, todo lo relacionado con una cuenta.
const searchRouter = require("./search-router");
const userRouter = require("./user-router");

module.exports = {
  accountRouter,
  searchRouter,
  userRouter
};
