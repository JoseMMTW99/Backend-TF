require('dotenv').config(); // Cargar variables de entorno
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Usar la clave secreta de Stripe

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Falta la clave secreta de Stripe en las variables de entorno');
}

async function createPayment(amount, currency, paymentMethodId, userId) {
    try {
      // Validaciones de los parámetros
      if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('El monto debe ser un número positivo.');
      }
      if (typeof currency !== 'string' || currency.length === 0) {
        throw new Error('La moneda debe ser una cadena no vacía.');
      }
      if (typeof paymentMethodId !== 'string' || paymentMethodId.length === 0) {
        throw new Error('El PaymentMethod ID debe ser una cadena no vacía.');
      }
      if (typeof userId !== 'string' || userId.length === 0) {
        throw new Error('El ID de usuario debe ser una cadena no vacía.');
      }
  
      // Crear el PaymentIntent con Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // El monto debe estar en centavos
        currency: currency,
        payment_method: paymentMethodId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId: userId, // Usar el ID real del usuario
        },
      });
  
      // Devolver el client_secret necesario para confirmar el pago en el frontend
      return paymentIntent;
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw new Error('No se pudo procesar el pago. Inténtelo de nuevo más tarde.');
    }
  }  

module.exports = {
  createPayment
};