const express = require('express');
const { Router } = require('express');

const router = Router();

// Endpoints para probar las cookies
router.get('/setCookie', (req, res) =>{
    // Mandamos una orden al navegador / 10.000.000 ms => 10.000 segundos
    res.cookie('CoderCookie', 'Esta es una cookie muy poderosa', {maxAge:10000000}).send('Cookie configurada correctamente')
})

router.get('/setCookieSigned', (req, res) =>{
    // Mandamos una orden al navegador / 10.000.000 ms => 10.000 segundos
    res.cookie('CoderCookieSigned', 'Esta es una cookie muy poderosa y firmada', {maxAge:10000000, signed:true}).send('Cookie configurada correctamente con Firma Secreta')
})

router.get('/getCookie', (req, res) =>{
    res.send(req.cookies)
})

router.get('/getCookieSigned', (req, res) =>{
    res.send(req.signedCookies) // Para las Cookies Firmadas
})

router.get('/deleteCookie', (req, res) =>{
    res.clearCookie('CoderCookie').send('Cookie borrada')
})

module.exports = router;