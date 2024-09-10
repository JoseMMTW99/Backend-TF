const chai = require('chai');
const { UsersDaoMongo } = require("../src/daos/MONGO/usersDaoMongo");
const { createHash, isValidPassword } = require('../src/utils/bcrypt');
const UserDto = require('../src/dtos/user.dto');

const expect = chai.expect;

describe('Testing Bcrypt utilidad', () => {
    it('El servicio debe devolver un hash efectivo del password', async () => {
        const password = '123456';
        const hashPassword = await createHash(password);
        expect(hashPassword).to.not.equal(password);
    });

    it('El hash realizado debe poder compararse de manera efectiva con el pass original', async () => {
        const password = '123456';
        const hashPassword = await createHash(password);

        const passwordValid = await isValidPassword(password, hashPassword);
        expect(passwordValid).to.be.true;
    });

    it('El hash realizado al ser alterado debe fallar la prueba', async () => {
        const password = '123456';
        const hashPassword = await createHash(password);
        const hashAlterado = hashPassword + '10';

        const passwordValid = await isValidPassword(password, hashAlterado);
        expect(passwordValid).to.be.false;
    });
});

describe('Testing del UserDto', () => {
    before(function () {
        this.userDto = UserDto;
    });

    it('El dto debe unificar el nombre y el apellido en una única propiedad llamada username', function () {
        const userMock = {
            first_name: 'Usuario',
            last_name: 'Hands',
            email: 'usuariohands@gmail.com',
            password: '123456',
        };
        const userDtoInstance = new this.userDto(userMock);
        expect(userDtoInstance).to.have.property('username', 'Usuario Hands');
    });

    it('El dto debe eliminar las propiedades first_name, last_name y password', function () {
        const userMock = {
            first_name: 'Usuario',
            last_name: 'Hands',
            email: 'usuariohands@gmail.com',
            password: '123456',
        };
        const userDtoInstance = new this.userDto(userMock);

        expect(userMock).to.not.have.property('first_name');
        expect(userMock).to.not.have.property('last_name');
        expect(userMock).to.not.have.property('password');
    });
});