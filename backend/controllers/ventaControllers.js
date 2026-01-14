import Venta from '../models/ventaModel.js';
import Carrito from '../models/carritoModel.js';

const controladorVenta = {
    finalizarCompra: async (req, res) => {
        console.log('DEBUG: PROCESANDO FINALIZACIÓN DE COMPRA');
        const id_usuario = parseInt(req.body.id_usuario);

        try {
            if (isNaN(id_usuario)) {
                return res.status(400).json({ exito: false, mensaje: 'ID de usuario no válido.' });
            }

            console.log(`Buscando productos en el carrito del usuario ${id_usuario}...`);
            const productosCarrito = await Carrito.obtenerPorUsuario(id_usuario);

            if (!productosCarrito || productosCarrito.length === 0) {
                console.log('VALIDACIÓN: Carrito vacío.');
                return res.status(400).json({ 
                    exito: false, 
                    mensaje: 'No hay productos en el carrito para realizar la compra.' 
                });
            }

            let totalVenta = 0;
            productosCarrito.forEach(item => {
                totalVenta += item.precio * item.cantidad;
            });
            console.log(`Total calculado: $${totalVenta.toFixed(2)}`);

            const idVentaGenerada = await Venta.crearVenta(id_usuario, totalVenta);
            console.log('Registrando detalles en la base de datos...');
            for (const item of productosCarrito) {
                await Venta.registrarDetalle(
                    idVentaGenerada, 
                    item.id_producto, 
                    item.cantidad, 
                    item.precio
                );
            }

            await Carrito.vaciar(id_usuario);

            console.log('--- VENTA COMPLETADA CON ÉXITO ---');

            res.status(201).json({ 
                exito: true, 
                mensaje: '¡Compra exitosa! Se envió la factura al correo electrónico, los códigos de los juegos llegarán en unos días.',
                id_venta: idVentaGenerada 
            });

        } catch (error) {
            console.error('ERROR EN PROCESO DE VENTA:', error.message);
            res.status(500).json({ 
                exito: false, 
                mensaje: 'Hubo un error al procesar tu compra. Por favor, intenta de nuevo.' 
            });
        }
    },

    obtenerHistorial: async (req, res) => {
        const { id_usuario } = req.params;
        try {
            const historial = await Venta.obtenerHistorial(id_usuario);
            res.json({ exito: true, historial });
        } catch (error) {
            console.error('ERROR AL OBTENER HISTORIAL:', error.message);
            res.status(500).json({ exito: false, mensaje: 'Error al obtener el historial.' });
        }
    }
};

export default controladorVenta;