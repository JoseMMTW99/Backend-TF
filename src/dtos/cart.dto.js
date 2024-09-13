class CartDto {
    constructor(product) {
        this.productId = product._id;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.category = product.category;
        this.stock = product.stock;
        this.quantity = product.quantity;
    }
}

module.exports = CartDto;