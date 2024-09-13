const express = require ('express');
const { Router } = require('express');
const { UsersDaoMongo } = require('../daos/MONGO/usersDaoMongo');
const auth = require('../middlewares/auth.middleware');
const UsersController = require('../controllers/users.controller');
const ProductsController = require('../controllers/products.controller')

const router = Router();
const userController = new UsersController();
const productsController = new ProductsController();

router.get('/', async (req, res) => {
    const user = req.session.user;

    try {
        // Obtén el número de página de la consulta, o usa 1 por defecto
        const numPage = parseInt(req.query.numPage) || 1;
        const limit = 12; // Define el límite de productos que deseas mostrar

        // Obtén los productos para la página correspondiente
        const productsData = await productsController.productService.getProducts({ limit, numPage });

        const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = productsData;

        res.render('home', {
            title: 'TF Backend',
            styles: "home.css",
            username: user ? user.username : null,
            nombre: user ? user.nombre : null,
            apellido: user ? user.apellido : null,
            role: user ? user.role === 'admin' : false,
            products: docs, // Pasa los productos a la vista
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        });
    } catch (error) {
        console.error('Error fetching products for home:', error);
        res.status(500).send({ status: 'error', error: 'Error fetching products for home' });
    }
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