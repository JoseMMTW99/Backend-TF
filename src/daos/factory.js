const { objectConfig, connectDB } = require("../config");

let ProductsDao;
let CartsDao;
let UsersDao;

const initializeDaos = async () => {
    switch (objectConfig.persistence) {
        case "MEMORY":
            // Asignar DAOs en memoria aquí si es necesario
            break;
        case "FS":
            const ProductDaoFS = require('./FS/ProductManagerFS')
            ProductsDao = new ProductDaoFS();
            // Asignar otros DAOs de FS si es necesario
            break;
        default: // MONGO
            await connectDB();
            const { ProductsDaoMongo } = require('./MONGO/productsDaoMongo');
            const { CartsDaoMongo } = require('./MONGO/cartsDaoMongo');
            const { UsersDaoMongo } = require('./MONGO/usersDaoMongo');
            ProductsDao = new ProductsDaoMongo();
            CartsDao = new CartsDaoMongo();
            UsersDao = new UsersDaoMongo();
            break;
    }
};

initializeDaos().then(() => {
    console.log('DAOs inicializados correctamente');
}).catch(error => {
    console.error('Error inicializando DAOs:', error);
});

module.exports = {
    initializeDaos,
    get ProductsDao() { return ProductsDao; },
    get CartsDao() { return CartsDao; },
    get UsersDao() { return UsersDao; }
};