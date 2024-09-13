function addToCart(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value, 10);
    const userId = window.userId; // Obtén el userId desde el global

    console.log(`Product ID: ${productId}, Quantity: ${quantity}`);
    console.log(`User ID: ${userId}`);

    // Verifica que la cantidad esté dentro de los límites permitidos
    if (quantity < 1) {
        console.log("La cantidad es menor que 1.");
        alert("La cantidad mínima es 1.");
        return;
    }

    const maxQuantity = parseInt(quantityInput.max, 10);
    console.log(`Cantidad máxima permitida: ${maxQuantity}`);
    if (quantity > maxQuantity) {
        console.log("La cantidad supera el máximo permitido.");
        alert(`La cantidad máxima es ${maxQuantity}.`);
        return;
    }

    // Realiza una petición al servidor para agregar el producto al carrito
    fetch(`/api/carts/addProduct`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId, quantity, userId }) // Incluye el userId en el cuerpo
    })
    .then(response => {
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || "Error al agregar el producto al carrito");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data);
        alert("Producto agregado al carrito con éxito");
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        alert("Hubo un problema al agregar el producto al carrito.");
    });
}