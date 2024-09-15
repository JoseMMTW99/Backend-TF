const express = require('express');
const router = express.Router();
const { createPayment } = require('../../service/payment.service');

/**
 * Endpoint para manejar la solicitud de pago.
 * Valida los datos de la solicitud, llama al servicio de pago y maneja los errores.
 */
router.post('/', async (req, res) => {
    console.log('Datos recibidos:', req.body);
  
    try {
      // Obtener los datos de la solicitud, incluido el userId
      const { amount, currency, paymentMethodId, userId } = req.body;
  
      // Validar los datos recibidos
      if (!userId) {
        console.error('Falta userId en la solicitud');
        return res.status(400).json({ error: 'Falta userId en la solicitud' });
      }
      if (amount === undefined || currency === undefined || paymentMethodId === undefined) {
        console.error('Faltan datos en la solicitud');
        return res.status(400).json({ error: 'Faltan datos en la solicitud' });
      }
  
      // Llamar al servicio para crear el pago
      const paymentIntent = await createPayment(amount, currency, paymentMethodId, userId);
  
      // Responder con éxito, enviando el PaymentIntent
      res.json({ success: true, paymentIntent });
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar el pago:', {
        type: error.type,
        message: error.message,
        code: error.code,
        param: error.param
      });
      res.status(500).json({ error: 'Error al procesar el pago. Inténtelo de nuevo más tarde.' });
    }
  });  

module.exports = router;