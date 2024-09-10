const express = require ('express');
const { Router } = require('express');
const { CartsDaoMongo } = require('../../daos/MONGO/cartsDaoMongo');

const router = Router();

const cartService = new CartsDaoMongo()

router.get('/', async (req, res) => {
    const carts = await cartService.getCarts();
    res.send(carts) 
})
router.post('/', async (req, res) => {
    const carts = await cartService.createCart();
    res.send(carts) 
})
router.post('/:id/products/:pid', async (req, res) => {
    const {cid, pid} = req.params;
    const result = await cartService.addProduct(cid, pid);
    res.send(result)
})

module.exports = router;