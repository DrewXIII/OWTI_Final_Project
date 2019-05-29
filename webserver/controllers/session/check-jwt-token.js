"use strict";

const jwt = require("jsonwebtoken"); // An implementation of JSON Web Tokens.

const { AUTH_JWT_SECRET: authJwtSecret } = process.env;

// Creamos una función donde vamos a comprobar el JWT

function checkJwtToken(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send(); // 401 Unauthorized error
  }

  const [prefix, token] = authorization.split(" "); // [JWT, xxxx]
  if (prefix !== "JWT") {
    return res.status(401).send(); // 401 Unauthorized error
  }

  if (!token) {
    return res.status(401).send(); // 401 Unauthorized error
  }

  try {
    const decoded = jwt.verify(token, authJwtSecret);

    req.claims = {
      uuid: decoded.uuid,
      role: decoded.role
    };

    return next();
  } catch (e) {
    return res.status(401).send(); // 401 Unauthorized error
  }
}

module.exports = checkJwtToken;
