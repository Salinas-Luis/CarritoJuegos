import db from '../config/db.js';

const Producto = {
    obtenerTodos: async () => {
        console.log('MODELO: Obteniendo lista completa de juegos');
        try {
            const consulta = 'SELECT * FROM producto';
            const [filas] = await db.execute(consulta);
            console.log(`Consulta exitosa: se encontraron ${filas.length} juegos.`);
            return filas;
        } catch (error) {
            console.error('ERROR EN MODELO (obtenerTodos):', error.message);
            throw error;
        }
    },

    obtenerPorId: async (id) => {
        console.log(`MODELO: Buscando juego con ID: ${id}`);
        try {
            const consulta = 'SELECT * FROM producto WHERE id_producto = ?';
            const [filas] = await db.execute(consulta, [id]);
            
            if (filas.length > 0) {
                console.log('Juego encontrado:', filas[0].nombre);
            } else {
                console.log('No se encontró ningún juego con ese ID.');
            }
            return filas[0];
        } catch (error) {
            console.error('ERROR EN MODELO (obtenerPorId):', error.message);
            throw error;
        }
    },

    obtenerPorCategoria: async (categoria) => {
        console.log(`MODELO: Filtrando por categoría: ${categoria}`);
        try {
            const consulta = 'SELECT * FROM producto WHERE descripcion LIKE ?';
            const [filas] = await db.execute(consulta, [`%${categoria}%`]);
            console.log(`Filtro aplicado: ${filas.length} resultados.`);
            return filas;
        } catch (error) {
            console.error('ERROR EN MODELO (obtenerPorCategoria):', error.message);
            throw error;
        }
    }
};

export default Producto;