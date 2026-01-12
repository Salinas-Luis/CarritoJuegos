import db from '../config/db.js';

const Venta = {
    crearVenta: async (id_usuario, total) => {
        console.log(`MODELO VENTA: Registrando venta total de $${total} para usuario ${id_usuario}`);
        try {
            const consulta = 'INSERT INTO venta (id_usuario, total) VALUES (?, ?)';
            const [resultado] = await db.execute(consulta, [id_usuario, total]);
            console.log('Venta principal registrada con ID:', resultado.insertId);
            return resultado.insertId; 
        } catch (error) {
            console.error('ERROR EN MODELO VENTA (crearVenta):', error.message);
            throw error;
        }
    },

    registrarDetalle: async (id_venta, id_producto, cantidad, precio_unitario) => {
        console.log(`MODELO VENTA: Registrando detalle (Venta: ${id_venta}, Producto: ${id_producto})`);
        try {
            const consulta = 'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)';
            const [resultado] = await db.execute(consulta, [id_venta, id_producto, cantidad, precio_unitario]);
            console.log(`Detalle guardado correctamente.`);
            return resultado;
        } catch (error) {
            console.error('ERROR EN MODELO VENTA (registrarDetalle):', error.message);
            throw error;
        }
    },

    obtenerHistorial: async (id_usuario) => {
        console.log(`MODELO VENTA: Obteniendo historial del usuario ${id_usuario}`);
        try {
            const consulta = 'SELECT * FROM venta WHERE id_usuario = ? ORDER BY fecha_venta DESC';
            const [filas] = await db.execute(consulta, [id_usuario]);
            console.log(` Historial recuperado: ${filas.length} compras encontradas.`);
            return filas;
        } catch (error) {
            console.error('ERROR EN MODELO VENTA (obtenerHistorial):', error.message);
            throw error;
        }
    }
};

export default Venta;