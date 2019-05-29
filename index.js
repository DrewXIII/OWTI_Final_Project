"use strict";
// Separo el llamamiento a las librerías del llamamiento a los archivos de mi proyecto.

// Librerías utilizadas en este archivo:

require("dotenv").config(); // Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
const bodyParser = require("body-parser"); // Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const express = require("express"); //Fast, unopinionated, minimalist web framework for node.

// Archivos que necesito en este archivo:

const mongoPool = require("./databases/mongo-pool"); // Esto es para usar Mongo DB.
const routers = require("./webserver/routes"); // Aquí llamo a todas las rutas que se van a poder utilizar en este Backend y que tengo hechas en otros archivos.

const app = express();
app.use(bodyParser.json()); // Parse application/json

// Lo que está a continuación es por si hay un problema con el body.

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).send({
    error: `Body parser: ${err.message}`
  }); // 400 Bad Request Error
});

// Activo los endpoints que van a estar disponibles

app.use("/api", routers.accountRouter);
app.use("/api", routers.postRouter);
app.use("/api", routers.userRouter);

// Lo que está a continuación es por si hay un error en la cuenta.

app.use((err, req, res, next) => {
  const { name: errorName } = err;

  if (errorName === "AccountNotActivatedError") {
    return res.status(403).send({
      message: err.message
    }); // 403 Forbidden
  }

  return res.status(500).send({
    error: err.message
  }); // 500 Internal Server Error
});

// Por último, activo la conexión a Mongo DB y al puerto.
async function init() {
  try {
    await mongoPool.connect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server running and listening on port ${port}`);
  });
}

init();
