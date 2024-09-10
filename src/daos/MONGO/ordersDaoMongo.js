const { ordersModel } = require('../../models/order.models')

// Esto lo que haria es traer solo pizzas medianas que tengamos en nuestro array (no tengo)
let result = await ordersModel.aggregate([
    {
        // primer paso (busca el tipo de pizzas)
        $match: {size: 'medium'}
    },
    {
        // segundo paso (suma la cantidad) ("$name" seria por asi decirlo el this.name en el array, asi encuentre por nombre )
        $group:{_id: "$name", totalQuantity: {$sum: "quantity"}}
    },
    {
        // tercer paso (ordena de menor a mayor)
        $sort: {totalQuantity: -1}
    },
    {
        // Agrega el array al campo orders
        $group: {_id:1, orders: {$push: "$$ROOT"}}
    },
    {
        // {"_id":0} significa que le cree un ID propio de MongoDB
        $project: {"_id":0, orders: "$orders"}
    },
    {
        // Guarda al array en un coleccion llamada "Reports"
        $merge: {into: 'reports'}
    }
])

console.log(result)