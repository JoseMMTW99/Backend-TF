const assert = require('assert');
const mongoose = require('mongoose');
const { UsersDaoMongo } = require("../src/daos/MONGO/usersDaoMongo");


mongoose.connect('mongodb+srv://JoseMMTW99:PublicA%21160499@josemmtw99.7cp9mo3.mongodb.net/Backend_Clases?retryWrites=true&w=majority&appName=JoseMMTW99');


describe('Test UsersDaoMongo', function () {
    before(function () {
        this.userDao = new UsersDaoMongo();
    });

    beforeEach(async function() {
        await mongoose.connection.collections['usuarios'].drop();
        this.timeout(5000);
    });

    it('El dao debe obtener los usuarios en formato arreglo', async function () {
        const result = await this.userDao.getAll({ limit: 5, numPage: 1 });
        assert.strictEqual(Array.isArray(result.docs), true); // `result.docs` contiene el arreglo de usuarios al usar paginate
    });

    it('El dao debe agregar un usuario correctamente a la base de datos', async function () {
        const mockUser = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            username: "josemmtw99",
            email: 'josemmtw99@gmail.com',
            password: '123456'
        };

        const result = await this.userDao.create(mockUser);
        assert.ok(result._id);
    });

    it('El dao puede obtener a un usuario por email', async function () {
        const mockUser = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            username: "josemmtw99",
            email: 'josemmtw99@gmail.com',
            password: '123456'
        };

        await this.userDao.create(mockUser);
        const user = await this.userDao.getBy({ email: mockUser.email });

        assert.strictEqual(typeof user, 'object');
        assert.strictEqual(user.email, mockUser.email);
    });
});