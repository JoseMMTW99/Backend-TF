const express = require ('express');
const { Router } = require('express');
const { UsersDaoMongo } = require('../daos/MONGO/usersDaoMongo');
const auth = require('../middlewares/auth.middleware');
const UsersController = require('../controllers/users.controller');

const router = Router();
const userController = new UsersController();

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Mercadito || José',
        username: user.username,
        nombre: user.nombre,
        apellido: user. apellido,
        role: user.role === 'admin', // Pongo esto asi para que de True or False, porque en home.handlebars necesito como condicion un booleano, no se puede con un string como 'admin' hacer el {{#if}} porque no funciona.
        products,
        styles: "home.css"
    });
});

// Chat
router.get('/chat', (req, res) => {
    res.render('chat', {styles: "chat.css"})
})


// Paginación
router.get('/users', auth, userController.getUsers);

const user = {
    username: 'josemmtw99',
    nombre: 'José',
    apellido: 'Martínez Terán',
    role: 'admin'
}
const products = [
    { id: 1, nombre: "Laptop HP Pavilion", precio: 800 },
    { id: 2, nombre: "Monitor ASUS 24 pulgadas", precio: 200 },
    { id: 3, nombre: "Teclado mecánico Logitech G Pro", precio: 100 },
    { id: 4, nombre: "Mouse inalámbrico Microsoft Surface", precio: 50 },
    { id: 5, nombre: "Disco duro externo Seagate 1TB", precio: 60 }
]

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