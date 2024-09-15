function auth(req, res, next) {
    if (req.session?.user?.admin) {
        return next();
    } else {
        console.log('Rol del usuario:', req.session?.user?.admin ? 'Admin' : 'No Admin');
        // Redirige a la ruta /auth si el usuario no tiene permisos
        return res.redirect('/auth');
    }
}

module.exports = auth;