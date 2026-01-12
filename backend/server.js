import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './config/db.js'; 

import rutasUsuario from './routes/userRoutes.js';
import rutasProducto from './routes/productoRoutes.js';
import rutasCarrito from './routes/carritoRoutes.js';
import rutasVenta from './routes/ventaRoutes.js';

dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaFrontend = path.join(__dirname, '..', 'frontend');

app.set('view engine', 'ejs');
app.set('views', path.join(rutaFrontend, 'views'));

console.log('CONFIGURACIÓN: Cargando Middlewares');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(rutaFrontend, 'public')));

console.log('--- CONFIGURACIÓN: Conectando puntos finales (Endpoints) ---');
app.use('/api/usuarios', rutasUsuario);
app.use('/api/productos', rutasProducto);
app.use('/api/carrito', rutasCarrito);
app.use('/api/ventas', rutasVenta);

app.get('/', (req, res) => {
    res.render('registro', { titulo: 'Bienvenido - Inicia Sesión' });
});

app.get('/tienda', async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM producto');
        res.render('index', { 
            titulo: 'Catálogo de Juegos',
            mensaje: '¡Bienvenido a la tienda!',
            productos: productos 
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
        res.status(500).send("Error en el servidor");
    }
});

app.listen(PUERTO, () => {
     console.log(` Servidor corriendo en http://localhost:${PUERTO}`);
});