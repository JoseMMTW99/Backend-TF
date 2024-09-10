const { Router } = require("express");
const { fork } = require('child_process');
const router = Router();
const compression = require('express-compression')
const { faker } = require('@faker-js/faker');


function operacionCompleja() {
    let result = 0;

    for (let i = 0; i < 10e9; i++) {
        result +=1;
    }
    return result;
}

router.get('/simple', (req, res) => {
    const result = operacionCompleja();
    res.send({result});
});

router.get('/compleja', (req, res) => {
    const child = fork('./routes/operacionCompleja.js')
    child.send('Inicia el cálculo')
    child.on('message', result => {
        res.send({result});
    })
})


// CLASE 30

router.get('/mail', async (req,res) => {
    try {
        const user = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            email: 'josemmtw99@gmail.com'
        }
        sendEmail({
            email: user.email,
            subject: 'Email de Prueba',
            html: `<h1>Bienvenido ${user.first_name} ${user.last_name}</h1>`
        });
        res.send('Email enviado a su casilla')
    } catch (error) {
        console.log(error)
    }
})

router.get('/sms', async (req,res) => {
    try {
        const user = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            email: 'josemmtw99@gmail.com'
        }
        // sendSms();
        res.send('Sms enviado')
    } catch (error) {
        console.log(error)
    }
})

// CLASE 32

router.use(compression({
    brotli: {
        enabled:true,
        zlib: {}
    }
}))
router.get('/stringmuylargo', (req, res) => {
    let string = 'Hola Coders, soy un string muy largo'
    for (let i = 0; i < 5e4; i++) {
        string += 'Hola Coders, soy un string muy largo'
    }
    res.status(200).send(string)
})

// CLASE 34

router.get('/loggertest', (req, res) => {
    req.logger.warning('Alerta!!')
    req.logger.fatal('Alerta!!')
    req.logger.error('Alerta!!')
    res.send('logs')
})

router.get('/test/user', (req, res)=>{
    let first_name = faker.person.firstName()
    let last_name = faker.person.lastName()
    let email = faker.internet.email()
    let password = faker.internet.password()

    res.send({
        first_name,
        last_name,
        email,
        password

    })
})

module.exports = router;