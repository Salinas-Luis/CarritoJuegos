import Carrito from '../models/carritoModel.js';

const controladorCarrito = {
    agregar: async (req, res) => {
        console.log('DEBUG: INTENTO DE AGREGAR AL CARRITO');
        const { id_usuario, id_producto, cantidad } = req.body;

        try {
            if (!id_usuario || !id_producto || !cantidad) {
                console.log('VALIDACIÓN: Faltan IDs o cantidad.');
                return res.status(400).json({ mensaje: 'Datos incompletos para el carrito.' });
            }

            console.log(`Usuario ${id_usuario} quiere ${cantidad} unidades del juego ${id_producto}`);
            await Carrito.agregar(id_usuario, id_producto, cantidad);

            console.log('ÉXITO: Producto gestionado en el carrito.');
            res.json({ exito: true, mensaje: 'Producto añadido correctamente.' });
        } catch (error) {
            console.error('ERROR EN AGREGAR AL CARRITO:', error.message);
            res.status(500).json({ mensaje: 'Error al añadir el juego al carrito.' });
        }
    },

    verCarrito: async (req, res) => {
        const { id_usuario } = req.params;
        console.log(`DEBUG: CARGANDO CARRITO DEL USUARIO ${id_usuario}`);

        try {
            const items = await Carrito.obtenerPorUsuario(id_usuario);
            
            if (items.length === 0) {
                console.log('El carrito de este usuario está vacío.');
                return res.json({ mensaje: 'Tu carrito está vacío', productos: [] });
            }

            console.log(`ÉXITO: Se encontraron ${items.length} productos en el carrito.`);
            res.json(items);
        } catch (error) {
            console.error('ERROR EN VER CARRITO:', error.message);
            res.status(500).json({ mensaje: 'Error al cargar el carrito.' });
        }
    },

    eliminarDelCarrito: async (req, res) => {
        const { id_usuario } = req.body;
        console.log(`--- DEBUG: VACIANDO CARRITO DEL USUARIO ${id_usuario} ---`);

        try {
            await Carrito.vaciar(id_usuario);
            console.log('Carrito limpiado con éxito.');
            res.json({ exito: true, mensaje: 'Carrito vaciado.' });
        } catch (error) {
            console.error('ERROR EN ELIMINAR DEL CARRITO:', error.message);
            res.status(500).json({ mensaje: 'Error al vaciar el carrito.' });
        }
    }
};

export default controladorCarrito;