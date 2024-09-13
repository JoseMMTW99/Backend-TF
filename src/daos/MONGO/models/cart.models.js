const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    role: String,
    cart: {
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: Number,
                price: Number,
                title: String,
                description: String,
                category: String,
                stock: Number
            }
        ]
    }
});

const User = mongoose.model('User', userSchema);