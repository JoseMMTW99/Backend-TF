const express = require("express");
const { Router } = require("express");
const auth = require("../../middlewares/auth.middleware");
const { UsersDaoMongo } = require("../../daos/MONGO/usersDaoMongo");
const { createHash, isValidPassword } = require("../../utils/bcrypt");
const passport = require("passport");
const { generateToken, authToken } = require("../../utils/jsonwebtoken");
const passportCall = require("../../utils/passportCall");
const authorization = require("../../utils/authorizationJWT");

const router = Router();

const UserRepository  = require('../../repositories/user.repository'); // Ajusta la ruta según sea necesario

const userService = new UserRepository();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validar si vienen los datos
    if (!email || !password || !first_name || !last_name)
      return res
        .status(401)
        .send({ status: "error", error: "Ingrese todos los datos necesarios" });

    // Validar si existe el usuario
    const userExist = await userService.getUserBy({ email });
    if (userExist)
      return res
        .status(401)
        .send({ status: "error", error: "El usuario ya existe" });

    const newUser = {
      first_name,
      last_name,
      email,
      password: createHash(password),
    };

    const result = await userService.createUser(newUser);

    // Datos que se guardan dentro del Token
    const token = generateToken({
      id: result._id,
      email: result.email
    });

    res.send({ status: 'success', token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'error', error: 'Error en el registro' });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar si se proporcionan el correo electrónico y la contraseña
    if (!email || !password) {
      return res.status(401).send({
        status: "error",
        error: "Ingrese todos los datos necesarios"
      });
    }

    // Buscar al usuario por correo electrónico
    const userFound = await userService.getUserBy({ email });

    // Validar si el usuario existe
    if (!userFound) {
      return res.status(400).send({
        status: "error",
        error: "Usuario no encontrado"
      });
    }

    // Comparar la contraseña proporcionada con la almacenada (hasheada) en la base de datos
    if (!isValidPassword(password, { password: userFound.password })) {
      return res.status(401).send({
        status: "error",
        error: "Contraseña incorrecta"
      });
    }

    // Establecer la sesión del usuario con toda la información necesaria
    req.session.user = {
      id: userFound._id,
      username: userFound.username,
      nombre: userFound.first_name,
      apellido: userFound.last_name,
      email: userFound.email,
      role: userFound.role,
      admin: userFound.role === "admin" // Booleano para identificar si es admin
    };

    console.log("Usuario autenticado:", req.session.user);

    // Generar un token JWT con la información del usuario
    const token = generateToken({
      id: userFound._id,
      email: userFound.email,
      role: userFound.role
    });

    // Guardar el token en una cookie con opciones seguras
    res.cookie('coderCookieToken', token, {
      maxAge: 60 * 60 * 1000 * 24, // 1 día
      httpOnly: true // Solo accesible por solicitudes HTTP
    });

    // Loguear el token en la consola
    console.log("Token generado:", token);

    // Redirigir al home después de un login exitoso
    res.redirect('/');

  } catch (error) {
    console.error("Error en el proceso de login:", error);
    res.status(500).send({ status: "error", error: "Error en el servidor" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error al destruir la sesión:', error);
      return res.status(500).send({ status: "error", error: "Error al cerrar sesión" });
    }
    res.clearCookie('coderCookieToken'); // Borra la cookie del token
    res.redirect('/login');
  });
});

router.get('/github', passport.authenticate('github', {scope: 'user:email'}, async (req, resp) => {}))

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  if (!req.user) {
      return res.redirect('/login'); // o maneja el error de alguna otra manera
  }

  if (!req.user.email) {
      // Redirigir a la página donde el usuario puede proporcionar su correo electrónico
      req.session.tempUser = req.user; // Guarda la información temporalmente
      return res.redirect('/complete-profile');
  }
  req.session.user = req.user;
  res.redirect('/');
});


module.exports = router;