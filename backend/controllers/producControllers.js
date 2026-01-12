import Producto from '../models/productoModel.js';

const controladorProducto = {
    listarJuegos: async (req, res) => {
        console.log('DEBUG: INICIO DE LISTAR JUEGOS');
        try {
            console.log('Consultando catálogo completo a la base de datos...');
            const juegos = await Producto.obtenerTodos();

            if (juegos.length === 0) {
                console.log('ADVERTENCIA: La base de datos de juegos está vacía.');
                return res.status(200).json({ mensaje: 'No hay juegos disponibles por ahora', datos: [] });
            }

            console.log(`ÉXITO: Se enviaron ${juegos.length} videojuegos al Frontend.`);
            res.json(juegos);
        } catch (error) {
            console.error('ERROR EN LISTAR JUEGOS:', error.message);
            res.status(500).json({ mensaje: 'Error al cargar el catálogo de juegos.' });
        }
    },

    verDetalle: async (req, res) => {
        const { id } = req.params;
        console.log(`DEBUG: BUSCANDO DETALLES DEL JUEGO ID: ${id}`);

        try {
            const juego = await Producto.obtenerPorId(id);

            if (!juego) {
                console.log(`ERROR: No existe el juego con ID ${id}.`);
                return res.status(404).json({ mensaje: 'El videojuego solicitado no existe.' });
            }

            console.log(`ÉXITO: Juego encontrado: ${juego.nombre}`);
            res.json(juego);
        } catch (error) {
            console.error('ERROR EN VER DETALLE:', error.message);
            res.status(500).json({ mensaje: 'Error al obtener los detalles del juego.' });
        }
    },

    filtrarPorCategoria: async (req, res) => {
        const { categoria } = req.params;
        console.log(`DEBUG: FILTRANDO JUEGOS POR: ${categoria}`);

        try {
            const juegosFiltrados = await Producto.obtenerPorCategoria(categoria);
            console.log(`ÉXITO: Se encontraron ${juegosFiltrados.length} juegos de ${categoria}.`);
            res.json(juegosFiltrados);
        } catch (error) {
            console.error('ERROR EN FILTRAR JUEGOS:', error.message);
            res.status(500).json({ mensaje: 'Error al filtrar los juegos.' });
        }
    }
};

export default controladorProducto;