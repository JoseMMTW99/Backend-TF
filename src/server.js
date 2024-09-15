require('dotenv').config();

const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const initializatePassport = require('./config/passport.config');
const { objectConfig, connectDB } = require('./config/index');
const routerApp = require('./routes/index');
const path = require('path');
const mongoose = require('mongoose');
const FileStore = require('session-file-store')(session);
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const handleErrors = require('./middlewares/errors');
const { addLogger } = require('./utils/logger');
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const methodOverride = require('method-override');

const app = express();
const { port } = objectConfig;

// DOCUMENTACIÓN API
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de App de mi  proyecto Eccomerce',
            description: 'API para docuemtar eccomerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJsDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(cookieParser('s3cr3t0F1rma'));
app.use(cors());
app.use(addLogger)

// Configuración de express-session con MongoStore
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 60 * 60 * 1000 * 24 // 1 día en milisegundos
    }),
    secret: process.env.SESSION_SECRET || 's3cr3tC0der',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambiado a false para desarrollo local
}));

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(routerApp);
app.use(handleErrors())

// Guardamos en una constante el servirdor (app.listen)
const httpServer = app.listen(port, error => {
    if (error) console.log(error);
    console.log('Server escuchando en puerto ' + port);
})

const socketServer = new socketIO.Server(httpServer)

// Middleware para servir el script de Socket.IO
app.get('/socket.io/socket.io.js', (req, res) => {
    // Utiliza el módulo 'path' para construir la ruta al archivo
    res.sendFile(path.join(__dirname, '../../node_modules/socket.io/client-dist/socket.io.js'));
});

// Middleware para servir el script de SweetAlert2
app.get('/sweetalert2/sweetalert2.min.js', (req, res) => {
    // Utiliza el módulo 'path' para construir la ruta al archivo
    res.sendFile(path.join(__dirname, '../node_modules/sweetalert2/dist/sweetalert2.min.js'));
});

// Middleware para servir el archivo CSS de SweetAlert2
app.get('/sweetalert2/sweetalert2.min.css', (req, res) => {
    // Utiliza el módulo 'path' para construir la ruta al archivo
    res.sendFile(path.join(__dirname, '../node_modules/sweetalert2/dist/sweetalert2.min.css'));
});

// Configuración de Socket.IO
let messages = [];

socketServer.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('message', data=> {
        console.log('Message data: ', data);

        // Guardo los mensajes
        messages.push(data)

        // Emito los mensajes
        socketServer.emit('messageLogs', messages)
    })
})