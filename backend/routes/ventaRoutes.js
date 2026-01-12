import express from 'express';
import controladorVenta from '../controllers/ventaControllers.js';

const router = express.Router();

console.log('RUTAS: Cargando rutas de ventas');

router.post('/finalizar', controladorVenta.finalizarCompra);

router.get('/historial/:id_usuario', controladorVenta.obtenerHistorial);

export default router;