import db from '../config/db.js';

const Carrito = {
    agregar: async (id_usuario, id_producto, cantidad) => {
        console.log(`MODELO: Insertando en carrito -> Usuario: ${id_usuario}, Producto: ${id_producto}`);
        try {
            const consulta = `
                INSERT INTO carrito (id_usuario, id_producto, cantidad) 
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
            `;
            const [resultado] = await db.execute(consulta, [id_usuario, id_producto, cantidad]);
            return resultado;
        } catch (error) {
            console.error('ERROR EN MODELO CARRITO (agregar):', error.message);
            throw error;
        }
    },

    obtenerPorUsuario: async (id_usuario) => {
        console.log(`MODELO: Obteniendo carrito del usuario ${id_usuario}`);
        try {
            const consulta = `
                SELECT c.id_producto, p.nombre, p.precio, c.cantidad 
                FROM carrito c
                JOIN producto p ON c.id_producto = p.id_producto
                WHERE c.id_usuario = ?
            `;
            const [filas] = await db.execute(consulta, [id_usuario]);
            return filas;
        } catch (error) {
            console.error('ERROR EN MODELO CARRITO (obtenerPorUsuario):', error.message);
            throw error;
        }
    },

    vaciar: async (id_usuario) => {
        console.log(`MODELO: Vaciando carrito del usuario ${id_usuario}`);
        try {
            const consulta = 'DELETE FROM carrito WHERE id_usuario = ?';
            const [resultado] = await db.execute(consulta, [id_usuario]);
            return resultado;
        } catch (error) {
            console.error('ERROR EN MODELO CARRITO (vaciar):', error.message);
            throw error;
        }
    }
};

export default Carrito;