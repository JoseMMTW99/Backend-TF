const { Schema, model } = require('mongoose');

const CartSchema = new Schema({
    // userID: String
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'prpducts'
            },
            // quantity: Number
        }]
    }
})

CartSchema.pre('find', function(){
    this.populate('products.product')
})

const cartsModel = model('carts', CartSchema);
module.exports = { cartsModel };