function auth(req, res, next) {
   if (req.session?.user?.admin) {
       console.log('Rol del usuario:', req.session.user.admin ? 'Admin' : 'No Admin');
       return next();
   } else {
       console.log('Rol del usuario:', req.session?.user?.admin ? 'Admin' : 'No Admin');
       return res.status(401).send('Error de autorización');
   }
}

module.exports = auth;