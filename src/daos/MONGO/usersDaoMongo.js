const { userModel } = require("./models/users.models");

class UsersDaoMongo {
    constructor() {
        this.model = userModel;
    }

    // Obtener todos los usuarios
    getAll = async ({limit = 5, numPage = 1}) => {
        try {
            // Limit viene si no lo definis en 10, y la pagina en 1. "Lean: true" se usa para que me funcione el json
            return await this.model.paginate({},{limit, page: numPage, lean:true}); 
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    // Get dinámico
    async getBy(filter) {
        try {
            return await this.model.findOne(filter); // Usar this.userModel para acceder al modelo de usuario
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            throw error;
        }
    }

    // Obtener un usuario por ID
    getById = async (uid) => {
        try {
            return await this.model.findById(uid);
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            throw error;
        }
    }

    // Crear un nuevo usuario
    create = async (userData) => {
        try {
            return await this.model.create(userData);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    // Actualizar un usuario por ID
    update = async (uid, userData) => {
        try {
            return await this.model.findByIdAndUpdate(uid, userData, { new: true });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    // Eliminar un usuario por ID
    remove = async (uid) => {
        try {
            return await this.model.findByIdAndDelete(uid);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }
}

module.exports = { UsersDaoMongo };