const chai = require('chai');
const mongoose = require('mongoose');
const { UsersDaoMongo } = require("../src/daos/MONGO/usersDaoMongo");

const expect = chai.expect;

// USO CHAI 4.3.4 PORQUE MAS RECIENTES NO FUNCIONAN CON CONST/REQUIRE, SINO SOLO CON IMPORT

mongoose.connect('mongodb+srv://JoseMMTW99:PublicA%21160499@josemmtw99.7cp9mo3.mongodb.net/Backend_Clases?retryWrites=true&w=majority&appName=JoseMMTW99');


describe('Test de UsersDaoMongo', function () {
    before(function () {
        this.userDao = new UsersDaoMongo();
    });

    beforeEach(async function () {
        await mongoose.connection.collections['usuarios'].drop();
        this.timeout(5000);
    });

    // Test para crear un nuevo usuario
    it('El dao debe crear un usuario correctamente', async function () {
        const mockUser = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            username: "josemmtw99",
            email: 'josemmtw99@gmail.com',
            password: '123456'
        };

        const result = await this.userDao.create(mockUser);
        expect(result).to.have.property('_id');
        expect(result.email).to.be.equals(mockUser.email);
    });

    // Test para obtener un usuario por filtro
    it('El dao debe obtener un usuario por un filtro', async function () {
        const mockUser = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            username: "josemmtw99",
            email: 'josemmtw99@gmail.com',
            password: '123456'
        };

        await this.userDao.create(mockUser);
        const user = await this.userDao.getBy({ email: mockUser.email });

        expect(user).to.be.an('object');
        expect(user.email).to.be.equals(mockUser.email);
    });

    // Test para obtener un usuario por ID
    it('El dao debe obtener un usuario por ID', async function () {
        const mockUser = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            username: "josemmtw99",
            email: 'josemmtw99@gmail.com',
            password: '123456'
        };

        const createdUser = await this.userDao.create(mockUser);
        const user = await this.userDao.getById(createdUser._id);

        expect(user).to.be.an('object');
        expect(user._id.toString()).to.be.equals(createdUser._id.toString());
    });

    // Test para actualizar un usuario por ID
    it('El dao debe actualizar un usuario por ID', async function () {
        const mockUser = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            username: "josemmtw99",
            email: 'josemmtw99@gmail.com',
            password: '123456'
        };

        const createdUser = await this.userDao.create(mockUser);

        const updatedUserData = {
            first_name: 'Pepe',
            last_name: 'Martínez Terán',
            username: "pepe99",
            email: 'pepe99@gmail.com',
            password: 'abcdef'
        };

        const updatedUser = await this.userDao.update(createdUser._id, updatedUserData);

        expect(updatedUser).to.be.an('object');
        expect(updatedUser.first_name).to.be.equals(updatedUserData.first_name);
        expect(updatedUser.email).to.be.equals(updatedUserData.email);
    });

    // Test para eliminar un usuario por ID
    it('El dao debe eliminar un usuario por ID', async function () {
        const mockUser = {
            first_name: 'José',
            last_name: 'Martínez Terán',
            username: "josemmtw99",
            email: 'josemmtw99@gmail.com',
            password: '123456'
        };

        const createdUser = await this.userDao.create(mockUser);
        const deletedUser = await this.userDao.remove(createdUser._id);

        expect(deletedUser).to.be.an('object');
        expect(deletedUser._id.toString()).to.be.equals(createdUser._id.toString());

        const userAfterDeletion = await this.userDao.getById(createdUser._id);
        expect(userAfterDeletion).to.be.null;
    });
});
