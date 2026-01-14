import Carrito from '../models/carritoModel.js';

const controladorCarrito = {
    agregar: async (req, res) => {
        console.log('DEBUG: AGREGANDO AL CARRITO');
        const id_usuario = parseInt(req.body.id_usuario);
        const id_producto = parseInt(req.body.id_producto);
        const cantidad = parseInt(req.body.cantidad) || 1;

        try {
            if (isNaN(id_usuario) || isNaN(id_producto)) {
                console.log('VALIDACIÓN FALLIDA: IDs no válidos o incompletos.');
                return res.status(400).json({ 
                    exito: false, 
                    mensaje: 'ID de usuario o producto no válido.' 
                });
            }

            console.log(`Usuario ${id_usuario} -> Producto ${id_producto} (Cant: ${cantidad})`);
            
            await Carrito.agregar(id_usuario, id_producto, cantidad);

            console.log('ÉXITO: Registro insertado en la tabla carrito.');
            res.json({ 
                exito: true, 
                mensaje: 'Juego guardado en tu carrito (BD).' 
            });
        } catch (error) {
            console.error('ERROR EN CONTROLADOR CARRITO:', error.message);
            res.status(500).json({ 
                exito: false, 
                mensaje: 'Error al conectar con la base de datos.' 
            });
        }
    },
        
    verCarrito: async (req, res) => {
        const id_usuario_param = req.params.id_usuario; 
        console.log(`--- DEBUG: CARGANDO CARRITO DEL USUARIO ${id_usuario_param} ---`);

        try {
            if (!id_usuario_param) {
                return res.status(400).json({ exito: false, mensaje: 'ID de usuario no proporcionado' });
            }
            const items = await Carrito.obtenerPorUsuario(id_usuario_param);
            
            console.log(`ÉXITO: Se encontraron ${items.length} productos para el usuario ${id_usuario_param}`);

            res.json({ 
                exito: true, 
                productos: items 
            });

        } catch (error) {
            console.error('ERROR EN VER CARRITO:', error.message);
            res.status(500).json({ exito: false, mensaje: 'Error al cargar el carrito de la base de datos.' });
        }
    },

    eliminarDelCarrito: async (req, res) => {
        const { id_usuario } = req.body;
        console.log(`EBUG: VACIANDO CARRITO (USUARIO ${id_usuario})`);

        try {
            if (!id_usuario) return res.status(400).json({ mensaje: 'ID de usuario requerido.' });

            await Carrito.vaciar(id_usuario);
            res.json({ exito: true, mensaje: 'Base de datos: Carrito vaciado.' });
        } catch (error) {
            console.error('ERROR AL VACIAR CARRITO:', error.message);
            res.status(500).json({ mensaje: 'No se pudo limpiar el carrito en la BD.' });
        }
    }
};

export default controladorCarrito;