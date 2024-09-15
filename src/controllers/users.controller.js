const UserDto = require("../dtos/user.dto");
const { userService } = require("../service");
const { generateUserError } = require("../service/error/info");
const { EError } = require("../service/error/enums");
const { CustomError } = require("../service/error/CustomError");

class UsersController {
    constructor() {
        this.userService = userService;
    }

    getUsers = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const numPage = parseInt(req.query.numPage) || 1;
            console.log(await this.userService.getUsers)
            const users = await this.userService.getUsers({ limit, numPage });

            // Extraer datos de paginación
            const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = users;

            res.render('users', {
                styles: "users.css",
                users: docs,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send({ status: 'error', error: 'Error fetching users' });
        }
    }

    getUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const userFound = await this.userService.getUserById(uid);
            if (!userFound) {
                return { status: 'error', error: 'Usuario no encontrado' }; // Cambia esto a un objeto
            }
            return { status: 'success', payload: userFound }; // Cambia esto a un objeto
        } catch (error) {
            console.error('Error fetching user:', error);
            return { status: 'error', error: 'Error fetching user' }; // Cambia esto a un objeto
        }
    }

    createUser = async (req, res, next) => {    
        try {
            const { first_name, last_name, email, password } = req.body;
            
            // Validación de campos
            if (!first_name || !last_name || !email) {
                const error = CustomError.createError({
                    name: 'Error al crear un usuario',
                    cause: generateUserError({ first_name, last_name, email }),
                    message: 'Error al crear un usuario',
                    code: EError.INVALID_TYPES_ERROR
                });
                return res.status(400).send({ status: 'error', error: error.message });
            }  
    
            // Crear nuevo usuario
            const newUser = {
                first_name,
                last_name,
                email,
                password
            };
    
            // Pasar al servicio para guardar en la base de datos
            const result = await userService.createUser(newUser);
    
            // Enviar respuesta exitosa
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            // Pasar el error al middleware de manejo de errores
            next(error);
        }
    }
    

    updateUser = async (req, res) => {
        const { uid } = req.params;
        const { first_name, last_name, email } = req.body;
        if (!first_name || !last_name || !email) return res.send({ status: 'error', error: 'Faltan Campos' });

        const updatedFields = {};
        if (first_name) updatedFields.first_name = first_name;
        if (last_name) updatedFields.last_name = last_name;
        if (email) updatedFields.email = email;

        try {
            const result = await this.userService.updateUser(uid, updatedFields);
            if (result.nModified === 0) {
                return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
            }
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send({ status: 'error', error: 'Error updating user' });
        }
    }

    deleteUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const result = await this.userService.deleteUser(uid);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send({ status: 'error', error: 'Error deleting user' });
        }
    }
}

module.exports = UsersController;