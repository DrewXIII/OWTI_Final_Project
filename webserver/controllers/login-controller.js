"use strict";

const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const AccountNotActivatedError = require("./errors/account-not-activated-error");
const UsersActivation = require("../../models/users-activation-model");
const Profile = require("../../models/profile-model");

async function validateData(payload) {
  const schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  };

  return Joi.validate(payload, schema);
}

async function login(req, res, next) {
  /**
   * Validar datos de entrada con Joi
   */
  const accountData = { ...req.body };
  try {
    await validateData(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

  /**
   * Check si existe el usuario en la bbdd
   */
  try {
    const userProfile = await Profile.findOne({ email: accountData.email });

    if (!userProfile) {
      return res.status(400).send("Invalid email or password");
    }

    /**
     * Paso 2: accountNotActivated
     */

    const usersActivation = await UsersActivation.findOne({
      userId: userProfile.uuid
    });
    if (!usersActivation || !usersActivation.verifiedAt) {
      return res.status(400).send("Please, activate your account");
    }

    /**
     * Paso3: La clave es valida?
     */
    const isPasswordCorrect = await bcrypt.compare(
      accountData.password,
      userProfile.password
    );
    if (isPasswordCorrect === false) {
      return res.status(400).send("Invalid email or password");
    }

    /**
     * Paso 4: Generar token JWT con uuid + role (admin) asociado al token
     * La duración del token es de 1 minuto (podria ir en variable de entorno)
     */
    const payloadJwt = {
      uuid: userProfile.uuid,
      role: "admin" // userData.role si viene de bbdd
    };

    const jwtTokenExpiration = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL, 10);
    const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, {
      expiresIn: jwtTokenExpiration
    });
    const response = {
      accessToken: token,
      expiresIn: jwtTokenExpiration
    };

    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
}

module.exports = login;
