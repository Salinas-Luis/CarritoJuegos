import express from 'express';
import controladorCarrito from '../controllers/carritoControllers.js';

const router = express.Router();

console.log('RUTAS: Cargando rutas del carrito');

router.post('/agregar', controladorCarrito.agregar);

router.get('/usuario/:id_usuario', controladorCarrito.verCarrito);

router.delete('/vaciar', controladorCarrito.eliminarDelCarrito);

export default router;