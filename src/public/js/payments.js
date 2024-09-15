document.addEventListener('DOMContentLoaded', () => {
    // Verifica si el elemento #card-element está en el DOM
    const cardElementContainer = document.getElementById('card-element');
    
    if (cardElementContainer) {
        const stripe = Stripe('pk_test_51PuktCC2AFEC71X6ywtsy57o3C0MuZoc3iqH6Zlhei2LWvHKPtXBU7ttyGncjgLHDTGXV2N3iyq86raHLwR5F5KE00Qcu8s705');
        const elements = stripe.elements();
        const cardElement = elements.create('card');
        cardElement.mount('#card-element');

        const checkoutForm = document.getElementById('checkoutForm');
        const userId = document.getElementById('userId').dataset.userId;
        const authToken = document.getElementById('authToken').value;

        checkoutForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                // Crear el método de pago con la tarjeta
                const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                    billing_details: {
                        name: document.getElementById('cardholder-name').value,
                        email: document.getElementById('cardholder-email').value,
                    },
                });

                if (paymentMethodError) {
                    console.error('Error al crear el PaymentMethod:', paymentMethodError);
                    alert('Error al crear el método de pago: ' + paymentMethodError.message);
                    return;
                }

                // Crear el PaymentIntent en el backend, enviando el paymentMethodId
                const response = await axios.post('/payments', {
                    amount: calculateCartTotal(), // Asegúrate de que esta función devuelva el total correcto en centavos
                    currency: 'usd', // Usa la misma moneda en el backend
                    userId,
                    paymentMethodId: paymentMethod.id, // Aquí enviamos el paymentMethodId
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                // Verifica si la respuesta contiene el PaymentIntent
                const paymentIntent = response.data.paymentIntent; 
                if (!paymentIntent || !paymentIntent.client_secret) {
                    console.error('Error: no se recibió el client_secret.');
                    alert('Hubo un error al procesar el pago. Intenta nuevamente.');
                    return;
                }

                console.log('PaymentIntent creado:', paymentIntent);

                // Confirmar el pago en el frontend
                const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
                    payment_method: paymentMethod.id, // Usamos el paymentMethodId obtenido antes
                });

                if (error) {
                    console.error('Error al confirmar el pago:', error);
                    alert('Error al procesar el pago: ' + error.message);
                } else if (confirmedPaymentIntent.status === 'succeeded') {
                    console.log('Pago realizado con éxito:', confirmedPaymentIntent);
                    alert('Pago realizado con éxito!');

                    // Limpiar el carrito
                    clearCart();
                } else {
                    console.error('El pago no se completó, estado:', confirmedPaymentIntent.status);
                    alert('El pago no se completó.');
                }
            } catch (error) {
                console.error('Error al crear el PaymentIntent:', error);
                alert('Error al procesar el pago.');
            }
        });

        /**
         * Calcula el total del carrito en centavos.
         */
        function calculateCartTotal() {
            const totalCostElement = document.getElementById('cart-total-cost');
            if (!totalCostElement) {
                console.error('Elemento #cart-total-cost no encontrado.');
                return 0;
            }

            // Obtén el valor del campo oculto
            const totalCost = parseFloat(totalCostElement.value.replace('$', '').replace(',', ''));
            if (isNaN(totalCost)) {
                console.error('El costo total no es un número válido.');
                return 0;
            }

            return Math.round(totalCost * 100); // Convertir a centavos
        }

        /**
         * Limpia el carrito del usuario.
         */
        function clearCart() {
            console.log("clearCart ha sido llamada");

            const userId = document.getElementById('userId').getAttribute('data-user-id');
            const token = document.getElementById('authToken').value; // Capturamos el token

            if (!userId || !token) {
                console.error('No se pudo obtener el ID del usuario o el token.');
                return;
            }

            console.log('User ID:', userId);
            console.log('Token:', token); // Verificamos que tenemos el token

            fetch(`/cart/${userId}/clearCart`, {
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
                    console.log('Carrito limpiado con éxito');
                    location.reload();
                } else {
                    console.error('Error al limpiar el carrito:', data.error || 'Error desconocido');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud de limpieza del carrito:', error);
            });
        }
    } else {
        console.warn('El elemento #card-element no está presente en el DOM.');
    }
});