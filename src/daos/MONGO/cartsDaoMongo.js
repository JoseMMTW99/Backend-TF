const { cartsModel } = require("./models/cart.models");

class CartsDaoMongo {
    constructor(){
        this.model = cartsModel;
    }

    getCarts = async () => await this.model.find()
    createCart = async () => await this.model. create({products: []})
    addProduct = async (cid, pid) => {
        const cart = await this.model.findOne({_id: cid})
        cart.products.push({product: pid})

        const resp = await cartsModel.findByIdAndUpdate({_id:cid}, cart)
    }
}

module.exports = { CartsDaoMongo };