"use strict";

const bcrypt = require("bcrypt"); // A library to help you hash passwords.
const Joi = require("joi"); // Object schema description language and validator for JavaScript objects.
const sendgridMail = require("@sendgrid/mail"); // This is a dedicated service for interaction with the mail endpoint of the Sendgrid v3 API.
const uuidV4 = require("uuid/v4"); // Simple, fast generation of RFC4122 UUIDS.This one generates and returns a RFC4122 v4 UUID (Universally Unique IDentifier).

const UserProfileModel = require("../../models/user-profile-model");
const UserActivation = require("../../models/user-activation-model");
const UserModel = require("../../models/user-model");
const WallModel = require("../../models/wall-model");

// La información de la librería de @sendgrid/mail me indica como utilizarla. Lo que está escrito a continuación sería el modelo. Yo tendré que hacer unos cambios para ajustarlo a lo que yo quiero, pero la base será la misma. La expresión viene a indicar que se mandará un correo (que yo tengo que crear) al usuario.

/**
 * The following is the minimum needed code to send a simple email. Use this
 *  example, and modify the 'to' and 'from' variables:
 *
 *
 * const sgMail = require('@sendgrid/mail');
 * sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 * const msg = {
 *  to: 'test@example.com',
 *  to: 'test@example.com',
 *  subject: 'Sending with Twilio SendGrid is Fun',
 *  text: 'and easy to do anywhere, even with Node.js',
 *  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
 * };
 * sgMail.send(msg);
 */

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

// Antes de continuar con el email de confirmación de la cuenta, debo de hacer el cómo se crea la cuenta.

// 1. Creo el esquema válido para poder crear la cuenta. Para eso uso Joi y sus validaciones. Lo que está a continuación es sacado directamente de la información de esta librería.

async function validateSchema(payload) {
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

/**
 * 2. Creo el muro que tendrá el usuario.
 */

async function createWall(uuid) {
  const data = {
    uuid,
    post: ""
  };

  const wall = await WallModel.create(data);

  return wall;
}

/**
 * 3. Creo el perfil que tendrá el usuario.
 */

async function createProfile(uuid) {
  const userProfileData = {
    uuid,
    avatarUrl: null,
    fullName: null,
    address: {
      addressLocality: null,
      addressRegion: null,
      postalCode: null,
      streetAddress: null
    },
    preferences: {
      twitter: null,
      instagram: null,
      facebook: null,
      web: null,
      description: null
    },
    contact: {
      email: null,
      phoneNumber: null
    }
  };

  const profileCreated = await UserModel.create(userProfileData);

  return profileCreated;
}

/**
 * 4. Creamos un uuid (universally unique identifier) para el usuario que se registra y lo insertamos en la base de datos.
 */

/**
 * Creates a verification code and stores this into the db.
 * @param {string} userId User's id
 * @returns The created code or null in case of error.
 */
async function addVerificationCode(uuid) {
  const verificationCode = uuidV4();
  const now = new Date();
  const createdAt = now
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");

  const userActivation = new UserActivation({
    uuid,
    verificationCode,
    createdAt
  });

  try {
    await userActivation.save();
    return verificationCode;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * 5. Creamos el mail de confirmación de registro que se va a mandar al usuario. En la librería de sendgrid está este esquema a seguir.
 */

async function sendEmailRegistration(userEmail, verificationCode) {
  const linkActivation = `http://localhost:3000/api/account/activate?verification_code=${verificationCode}`;
  const msg = {
    to: userEmail,
    from: {
      email: "owti@yopmail.com",
      name: "OWTI"
    },
    subject: "Welcome to OWTI",
    text: "Start helping people",
    html: `To confirm the account <a href="${linkActivation}">activate it here</a>`
  };

  const data = await sendgridMail.send(msg);

  return data;
}

/**
 * 6. Por último, creo la función que me va a crear la cuenta.
 */

async function createAccount(req, res, next) {
  const accountData = req.body;

  // Compruebo que los datos introducidos son correctos.

  try {
    await validateSchema(accountData);
  } catch (e) {
    return res.status(400).send(e); // 400 Bad Request - HTTP
  }

  /**
   * Dado que tenemos que insertar los datos del usuario en la base de datos, tenemos que hacer previamente lo siguiente:
   * 1. Generamos un uuid (universally unique identifier).
   * 2. Miramos la fecha en la cual se crea el usuario con createdAt.
   * 3. La password no la podemos meter directamente, tenemos que ocultarla. Para ello utilizamos la librería bcrypt y así hasheamos la clave y poder almacenarla con seguridad.
   *
   */

  const now = new Date();
  const securePassword = await bcrypt.hash(accountData.password, 10);
  const uuid = uuidV4();
  const createdAt = now
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");

  /**
   * Ahora ya podemos meter todo en la base de datos (Mongo DB).
   */

  try {
    const userProfileModel = new UserProfileModel({
      uuid,
      email: accountData.email,
      password: securePassword,
      createdAt
    });

    await userProfileModel.save();
    const verificationCode = await addVerificationCode(uuid);

    await sendEmailRegistration(accountData.email, verificationCode);
    console.log("Hello 1");
    await createWall(uuid);
    console.log("Hello 2");
    await createProfile(uuid);
    console.log("Hello 3");

    return res.status(201).send(); // 201 Created - HTTP
  } catch (e) {
    console.log("Error creating profile");
    console.log(e.message);
    return res.status(500).send(e.message); // 500 Internal Server Error - HTTP
  }
}

module.exports = createAccount;
