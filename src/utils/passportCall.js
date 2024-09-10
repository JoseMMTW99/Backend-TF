const passport = require('passport');

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err); // Si hay un error, pasarlo al siguiente middleware de manejo de errores
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            req.user = user; // Asignar el usuario autenticado a req.user
            next(); // Llamar a next para continuar con el siguiente middleware o ruta
        })(req, res, next); // Llamar a passport.authenticate con req, res, next
    };
};

module.exports = passportCall