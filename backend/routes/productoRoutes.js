import express from 'express';
import controladorProducto from '../controllers/producControllers.js';

const router = express.Router();

console.log('RUTAS: Cargando rutas de productos');

router.get('/todos', controladorProducto.listarJuegos);

router.get('/detalle/:id', controladorProducto.verDetalle);

router.get('/categoria/:categoria', controladorProducto.filtrarPorCategoria);

router.post('/', controladorProducto.crearJuego); 

router.put('/:id', controladorProducto.editarJuego);
     
router.delete('/:id', controladorProducto.eliminarJuego);
export default router;