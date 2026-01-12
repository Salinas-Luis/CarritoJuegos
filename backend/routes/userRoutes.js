import express from 'express';
import controladorUsuario from '../controllers/userControllers.js';

const router = express.Router();

console.log('RUTAS: Cargando rutas de usuario');
router.post('/registro', controladorUsuario.registrar);

router.post('/login', controladorUsuario.iniciarSesion);

router.put('/:id', controladorUsuario.actualizarPerfil);

export default router;