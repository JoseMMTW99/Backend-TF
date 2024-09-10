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

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) res.send({ status: "error", error: error });
    else return res.render("login");
  });
});

// Ruta para iniciar sesión del administrador
router.post("/loginAdmin", (req, res) => {
  const { email, password } = req.body;
  if (email !== "fede@gmail.com" || password !== 1234) {
    return res.send("Login Failed");
  }

  req.session.user = {
    email,
    admin: true,
  };

  console.log(req.session.user);
  res.send("Login Success");
});

// Ruta para cerrar sesión del administrador
router.get("/logoutAdmin", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.send({ status: "error", error: error });
    } else {
      return res.send("Admin logged out successfully");
    }
  });
});

// Endpoint con autenticación de Administrador
router.get("/adminData", auth, (req, res) => {
  res.send("Datos Sensibles que solo puede ver el admin");
});

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
    const { first_name, last_name, email, password } = req.body;

    // Validar si vienen los datos
    if (!email || !password)
      return res
        .status(401)
        .send({ status: "error", error: "Ingrese todos los datos necesarios" });

    const userFound = await userService.getUserBy({ email });

    if (!userFound)
      return res
        .status(400)
        .send({ status: "error", error: "Usuario no encontrado" });

    // Comparamos la contraseña ingresada hasheada con la de la base de datos
    // Esto nos retorna "true" o "false"
    if (!isValidPassword(password, { password: userFound.password }))
      return res
        .status(401)
        .send({ status: "error", error: "Contraseña incorrecta" });

    // Establecer la sesión del usuario
    req.session.user = {
      email: userFound.email,
      admin: userFound.role === "admin", // Si es admin nos devuelve un "true", sino "false"
    };

    console.log("Rol del usuario en sesión:", req.session.user.admin);

    // Datos que se guardan dentro del Token
    const token = generateToken({
      id:userFound._id,
      email,
      role: userFound.role
    })

    // Guardamos en los cookies los datos del usuario
    res
      .cookie('coderCookieToken',  token, {
        maxAge: 60*60*1000*24,  // Esto sería un día
        httpOnly: true // Esto hace que solo se pueda ver el token desde una consulta http
      })
      .send({status: 'succes', token});
  } catch (error) {
    console.log(error);
  }
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