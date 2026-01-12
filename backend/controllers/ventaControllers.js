import Venta from '../models/ventaModel.js';
import Carrito from '../models/carritoModel.js';

const controladorVenta = {
    finalizarCompra: async (req, res) => {
        console.log('DEBUG: INICIO DE PROCESAMIENTO DE VENTA');
        const { id_usuario } = req.body;

        try {
            console.log(`Buscando productos en el carrito del usuario ${id_usuario}...`);
            const productosCarrito = await Carrito.obtenerPorUsuario(id_usuario);

            if (productosCarrito.length === 0) {
                console.log('VALIDACIÓN: El carrito está vacío, no se puede vender.');
                return res.status(400).json({ mensaje: 'No hay productos en el carrito para realizar la compra.' });
            }

            let totalVenta = 0;
            productosCarrito.forEach(item => {
                totalVenta += item.precio * item.cantidad;
            });
            console.log(`Total calculado: $${totalVenta}`);

            const idVentaGenerada = await Venta.crearVenta(id_usuario, totalVenta);
            console.log(`Cabecera de venta creada. ID Ticket: ${idVentaGenerada}`);

            console.log('Registrando detalles de los productos...');
            for (const item of productosCarrito) {
                await Venta.registrarDetalle(
                    idVentaGenerada, 
                    item.id_producto, 
                    item.cantidad, 
                    item.precio
                );
                console.log(`Producto: ${item.nombre} registrado.`);
            }

            console.log('Vaciando el carrito del usuario...');
            await Carrito.vaciar(id_usuario);

            console.log('VENTA COMPLETADA CON ÉXITO');
            res.status(201).json({ 
                exito: true, 
                mensaje: 'Compra realizada con éxito. ¡Disfruta tus juegos!',
                id_venta: idVentaGenerada 
            });

        } catch (error) {
            console.error('ERROR EN PROCESO DE VENTA:', error.message);
            res.status(500).json({ mensaje: 'Error al procesar la compra.' });
        }
    },

    obtenerHistorial: async (req, res) => {
        const { id_usuario } = req.params;
        console.log(`DEBUG: Consultando historial de compras del usuario ${id_usuario}`);
        
        try {
            const historial = await Venta.obtenerHistorial(id_usuario);
            console.log(`Historial cargado: ${historial.length} ventas encontradas.`);
            res.json(historial);
        } catch (error) {
            console.error('ERROR AL OBTENER HISTORIAL:', error.message);
            res.status(500).json({ mensaje: 'Error al obtener el historial.' });
        }
    }
};

export default controladorVenta;