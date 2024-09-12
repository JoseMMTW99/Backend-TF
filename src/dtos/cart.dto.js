class CartDto {
    constructor(cart) {
        this.userId = cart.userId; // ID del usuario al que pertenece el carrito
        this.products = cart.products.map(product => ({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock
        })); // Lista de productos en el carrito
    }
}

module.exports = CartDto;