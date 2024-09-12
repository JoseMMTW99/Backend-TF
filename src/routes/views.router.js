const express = require ('express');
const { Router } = require('express');
const { UsersDaoMongo } = require('../daos/MONGO/usersDaoMongo');
const auth = require('../middlewares/auth.middleware');
const UsersController = require('../controllers/users.controller');

const router = Router();
const userController = new UsersController();

router.get('/', (req, res) => {
    // Obtener los datos del usuario desde la sesión
    const user = req.session.user;

    res.render('home', {
        title: 'TF Backend',
        styles: "home.css",
        // Pasar los datos del usuario al template
        username: user ? user.username : null,
        nombre: user ? user.nombre : null,
        apellido: user ? user.apellido : null,
        role: user ? user.role === 'admin' : false,
    });
});

// Chat
router.get('/chat', (req, res) => {
    res.render('chat', {styles: "chat.css"})
})

// Paginación
router.get('/users', auth, userController.getUsers);

// Login
router.get('/login', (req, res) => {
    res.render('login', {styles: "login.css"})
})

// Register
router.get('/register', (req, res) => {
    res.render('register', {styles: "register.css"})
})

// Pruebas
router.get('/pruebas', (req, res) => {
    res.render('pruebas', {styles: "register.css"})
})

module.exports = router;