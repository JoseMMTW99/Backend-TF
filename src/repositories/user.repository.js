const UserDto = require("../dtos/user.dto");
const { UsersDaoMongo } = require('../daos/MONGO/usersDaoMongo')

class UserRepository {
    constructor() {
        this.userManager = new UsersDaoMongo(); // Inicializa con una instancia de UserManagerMongo
    }

    async getUsers({ limit = 5, numPage = 1 }) {
        return await this.userManager.getAll({ limit, numPage });
    }

    async getUser(filter) {
        return await this.userManager.getBy(filter);
    }

    async getUserBy(filter) {
        return await this.userManager.getBy(filter);
    }
    
    async getUserById(uid) {
        return await this.userManager.getById(uid);
    }

    async createUser(user) {
        const newUser = new UserDto(user);
        return await this.userManager.create(newUser);
    }

    async updateUser(uid, userToUpdate) {
        return await this.userManager.update(uid, userToUpdate);
    }

    async deleteUser(uid) {
        return await this.userManager.delete(uid);
    }
}

module.exports = UserRepository;