document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los botones con el atributo `data-product-id`
    document.querySelectorAll('button[data-product-id]').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            if (productId) {
                removeProduct(productId); // Llamar a la función con el ID del producto
            } else {
                console.error('No se encontró el ID del producto en el botón.');
            }
        });
    });
});

function removeProduct(productId) {
    console.log("removeProduct ha sido llamada");

    // Capturamos el userId desde el span oculto en el DOM
    const userId = document.getElementById('userId').getAttribute('data-user-id');
    const token = document.getElementById('authToken').value; // Capturamos el token

    if (!userId || !productId || !token) {
        console.error('No se pudo obtener el ID del producto, el ID del usuario o el token.');
        return;
    }

    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    console.log('Token:', token); // Verificamos que tenemos el token

    fetch(`/cart/${userId}/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log("Respuesta del servidor:", response);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        if (data.status === 'success') {
            // Actualiza la vista después de eliminar el producto
            console.log('Producto eliminado con éxito');
            location.reload();
        } else {
            console.error('Error al eliminar el producto:', data.error || 'Error desconocido');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de eliminación:', error);
    });
}