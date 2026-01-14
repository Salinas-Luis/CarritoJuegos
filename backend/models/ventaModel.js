import db from '../config/db.js';

// models/ventaModel.js
const Venta = {
    crearVenta: async (id_usuario, total) => {
        try {
            const consulta = 'INSERT INTO venta (id_usuario, total, fecha_venta) VALUES (?, ?, NOW())';
            const [resultado] = await db.execute(consulta, [id_usuario, total]);
            return resultado.insertId; 
        } catch (error) {
            console.error('ERROR EN MODELO VENTA:', error.message);
            throw error;
        }
    },

    registrarDetalle: async (id_venta, id_producto, cantidad, precio) => {
        try {
            const consulta = 'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)';
            const [resultado] = await db.execute(consulta, [id_venta, id_producto, cantidad, precio]);
            return resultado;
        } catch (error) {
            console.error('ERROR EN DETALLE:', error.message);
            throw error;
        }
    }
};

export default Venta;