class CartDto {
    constructor(product) {
        this.productId = product.productId;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.category = product.category;
        this.stock = product.stock;
        this.quantity = product.quantity;
    }
}

module.exports = CartDto;