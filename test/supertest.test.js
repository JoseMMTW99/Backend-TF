const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest('http://localhost:8000');

describe('Test de Coderhouse Backend', () => {
    describe('Test de Usuarios', function() {
        this.timeout(5000); // Aumenta el timeout para pruebas asíncronas
        let createdUserId;
        let cookie;

        it('El endpoint POST /api/users debe crear un usuario correctamente', async () => {
            const userMock = {
                first_name: 'Usuario',
                last_name: 'Supertest',
                email: 'supertest@gmail.com',
                password: '123456'
            };

            const res = await requester.post('/api/users').send(userMock);

            expect(res.ok).to.be.true;
            expect(res.statusCode).to.be.equal(201);
            expect(res.body.payload).to.have.property('_id');
            createdUserId = res.body.payload._id;
        });

        it('El endpoint GET /api/users debe traer todos los usuarios correctamente', async () => {
            const res = await requester.get('/api/users');

            expect(res.ok).to.be.true;
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.payload.docs).to.be.an('array');
        });

        it('El endpoint GET /api/users/:uid debe traer un usuario correctamente', async () => {
            const res = await requester.get(`/api/users/${createdUserId}`);

            expect(res.ok).to.be.true;
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.payload).to.have.property('_id').that.equals(createdUserId);
        });

        it('El endpoint PUT /api/users/:uid debe actualizar un usuario correctamente', async () => {
            const updatedData = {
                first_name: 'Usuario',
                last_name: 'Supertest',
                email: 'supertest@gmail.com',
                password: '654321'
            };

            const res = await requester.put(`/api/users/${createdUserId}`).send(updatedData);

            expect(res.ok).to.be.true;
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.payload).to.have.property('last_name').that.equals('Supertest');
        });

        it('El endpoint DELETE /api/users/:uid debe eliminar un usuario correctamente', async () => {
            const res = await requester.delete(`/api/users/${createdUserId}`);

            expect(res.ok).to.be.true;
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.payload).to.have.property('_id').that.equals(createdUserId);
        });

        describe('Test avanzado de Session', function() {
            this.timeout(5000); // Aumenta el timeout para pruebas asíncronas

            it('Debe registrar correctamente a un usuario', async () => {
                const mockUser = {
                    first_name: 'Federico',
                    last_name: 'Osandón',
                    email: 'f@gmail.com',
                    password: '123456'
                };

                const res = await requester.post('/api/sessions/register').send(mockUser);
                expect(res.body.payload).to.be.ok;
            });

            it('Debe loguear correctamente a un usuario y DEVOLVER UNA COOKIE', async () => {
                const mockUser = {
                    email: 'f@gmail.com',
                    password: '123456'
                };

                const result = await requester.post('/api/sessions/login').send(mockUser);
                const cookieResult = result.headers['set-cookie'] ? result.headers['set-cookie'][0] : null;
                expect(cookieResult).to.be.ok;
                cookie = {
                    name: cookieResult.split('=')[0],
                    value: cookieResult.split('=')[1]
                };
                expect(cookie.name).to.be.ok.and.eql('coderCookie');
                expect(cookie.value).to.be.ok;
            });

            it('Debe enviar la cookie que contiene el usuario y devolver el usuario correctamente', async () => {
                const res = await requester.get('/api/sessions/current').set('cookie', [`${cookie.name}=${cookie.value}`]);
                expect(res.body.payload.email).to.be.eql('f@gmail.com');
            });
        });
    });
});