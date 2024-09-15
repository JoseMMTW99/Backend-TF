class UserDto {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.username = `${user.first_name} ${user.last_name}`;
        this.cart = user.cart || []; // Inicializa el carrito como un array vacío si no está definido
    }
}

module.exports = UserDto;