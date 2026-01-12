import db from '../config/db.js';

const Usuario = {
    crear: async (datosUsuario) => {
        const { nombre, email, password, direccion } = datosUsuario;
        console.log(`MODELO: Intentando registrar a ${nombre}`);
        
        try {
            const consulta = 'INSERT INTO usuario (nombre, email, password, direccion) VALUES (?, ?, ?, ?)';
            const [resultado] = await db.execute(consulta, [nombre, email, password, direccion]);
            
            console.log('MODELO: Usuario insertado correctamente en la BD.');
            return resultado;
        } catch (error) {
            console.error('MODELO ERROR (crear):', error.message);
            throw error;
        }
    },

    buscarPorEmail: async (email) => {
        console.log(`MODELO: Buscando email: ${email}`);
        
        try {
            const consulta = 'SELECT * FROM usuario WHERE email = ?';
            const [filas] = await db.execute(consulta, [email]);
            
            if (filas.length > 0) {
                console.log('MODELO: Usuario encontrado.');
            } else {
                console.log('MODELO: No se encontró el usuario.');
            }
            return filas[0];
        } catch (error) {
            console.error('MODELO ERROR (buscarPorEmail):', error.message);
            throw error;
        }
    },

    buscarPorId: async (id) => {
        console.log(`MODELO: Consultando datos del ID: ${id}`);
        
        try {
            const consulta = 'SELECT id_usuario, nombre, email, direccion, fecha_registro FROM usuario WHERE id_usuario = ?';
            const [filas] = await db.execute(consulta, [id]);
            return filas[0];
        } catch (error) {
            console.error('MODELO ERROR (buscarPorId):', error.message);
            throw error;
        }
    },

    actualizar: async (id, datosNuevos) => {
        const { nombre, direccion } = datosNuevos;
        console.log(`MODELO: Actualizando datos del usuario ID: ${id}`);
        
        try {
            const consulta = 'UPDATE usuario SET nombre = ?, direccion = ? WHERE id_usuario = ?';
            const [resultado] = await db.execute(consulta, [nombre, direccion, id]);
            return resultado;
        } catch (error) {
            console.error('MODELO ERROR (actualizar):', error.message);
            throw error;
        }
    }
};

export default Usuario;