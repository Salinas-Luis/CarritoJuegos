import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importamos la conexión a la base de datos (asegúrate de que db.js exporte la conexión)
import db from './config/db.js'; 

// Importación de rutas
import rutasUsuario from './routes/userRoutes.js';
import rutasProducto from './routes/productoRoutes.js';
import rutasCarrito from './routes/carritoRoutes.js';
import rutasVenta from './routes/ventaRoutes.js';

dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 3000;

// Configuración de rutas para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajusta esta ruta según donde tengas tu carpeta frontend
const rutaFrontend = path.join(__dirname, '..', 'frontend');

// CONFIGURACIÓN DE VISTAS (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(rutaFrontend, 'views'));

// MIDDLEWARES
console.log('CONFIGURACIÓN: Cargando Middlewares');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (CSS, JS del cliente, Imágenes)
app.use(express.static(path.join(rutaFrontend, 'public')));

// CONEXIÓN DE ENDPOINTS (Rutas de la API)
console.log('--- CONFIGURACIÓN: Conectando puntos finales (Endpoints) ---');
app.use('/api/usuario', rutasUsuario);
app.use('/api/productos', rutasProducto);
app.use('/api/carrito', rutasCarrito);
app.use('/api/ventas', rutasVenta);

// RUTAS DE NAVEGACIÓN (Renderizado de EJS)
app.get('/', (req, res) => {
    res.render('registro', { titulo: 'Bienvenido - Inicia Sesión' });
});

app.get('/tienda', async (req, res) => {
    try {
        // Usamos la conexión db para traer los productos de la tabla 'producto'
        // Nota: Asegúrate que db sea la versión con promesas (mysql2/promise)
        const [productos] = await db.query('SELECT * FROM producto');
        
        res.render('index', { 
            titulo: 'Catálogo de Juegos',
            mensaje: '¡Bienvenido a la tienda!',
            productos: productos 
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
        res.status(500).send("Error interno en el servidor al cargar el catálogo.");
    }
});

// INICIO DEL SERVIDOR
app.listen(PUERTO, () => {
     console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});