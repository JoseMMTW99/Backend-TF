const { Router } = require("express");
const { createHash, isValidPassword } = require("../../utils/bcrypt");
const passport = require("passport");
const { generateToken } = require("../../utils/jsonwebtoken");

const router = Router();

const UserRepository = require('../../repositories/user.repository'); // Ajusta la ruta según sea necesario
const userService = new UserRepository();

router.post("/registerAdmin", async (req, res, next) => {
  try {    
    const { first_name, last_name, email, password } = req.body;

    // Validar si vienen los datos
    if (!email || !password || !first_name || !last_name) {
        console.log("Faltan datos en la solicitud");
        return res
            .status(401)
            .send({ status: "error", error: "Ingrese todos los datos necesarios" });
    }

    // Validar si existe el usuario
    const userExist = await userService.getUserBy({ email });
    console.log("Usuario ya existe:", userExist);
    if (userExist) {
        console.log("Intento de registro de usuario existente");
        return res
            .status(401)
            .send({ status: "error", error: "El usuario ya existe" });
    }

    // Hash de la contraseña
    const hashedPassword = createHash(password);

    // Crear el nuevo usuario con rol admin
    const newUser = {
        username: `${first_name} ${last_name}`,
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: "admin" // Asegúrate de definir el rol aquí
    };

    // Pasar al servicio para guardar en la base de datos
    const result = await userService.createUser(newUser);

    // Redirigir a la página de login si se crea el usuario correctamente
    res.redirect('/login');
  } catch (error) {
    console.log("Error en el registro:", error);
    res.status(500).send({ status: 'error', error: 'Error en el registro' });
  }
});

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

      // Hash de la contraseña
      const hashedPassword = createHash(password);
      console.log(hashedPassword);

      const newUser = {
          username: `${first_name} ${last_name}`,
          first_name,
          last_name,
          email,
          password: hashedPassword,
          role: "user"
      };

      const result = await userService.createUser(newUser);

      // Redirigir a la página de login si se crea el usuario correctamente
      res.redirect('/login');
  } catch (error) {
      console.log(error);
      res.status(500).send({ status: 'error', error: 'Error en el registro' });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).send({
        status: "error",
        error: "Ingrese todos los datos necesarios"
      });
    }

    const userFound = await userService.getUserBy({ email });

    if (!userFound) {
      return res.status(400).send({
        status: "error",
        error: "Usuario no encontrado"
      });
    }

    console.log('Hash de la contraseña almacenado:', userFound.password);

    if (!isValidPassword(password, userFound.password)) {
      return res.status(401).send({
        status: "error",
        error: "Contraseña incorrecta"
      });
    }

    req.session.user = {
      id: userFound._id,
      username: userFound.username,
      nombre: userFound.first_name,
      apellido: userFound.last_name,
      email: userFound.email,
      role: userFound.role,
      admin: userFound.role === "admin"
    };

    console.log("Usuario autenticado:", req.session.user);

    const token = generateToken({
      id: userFound._id,
      email: userFound.email,
      role: userFound.role
    });

    res.cookie('coderCookieToken', token, {
      maxAge: 60 * 60 * 1000 * 24, // 1 día en milisegundos
      httpOnly: false, 
      sameSite: 'Lax'
    });

    // Guardar el token en la sesión
    req.session.token = token;

    // Forzar a guardar la sesión antes de redirigir
    req.session.save((err) => {
      if (err) {
        console.error("Error guardando la sesión:", err);
        return res.status(500).send({ status: "error", error: "Error guardando la sesión" });
      }
      
      // Redirigir solo después de que la sesión se haya guardado correctamente
      res.redirect('/');
    });

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
        res.redirect('/');
    });
});

router.get('/github', passport.authenticate('github', { scope: 'user:email' }));

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