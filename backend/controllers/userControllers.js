import Usuario from '../models/userModel.js';

const controladorUsuario = {
    registrar: async (req, res) => {
        console.log('--- DEBUG: INICIO DE PROCESO DE REGISTRO ---');
        console.log('Datos que llegaron al servidor:', req.body);

        try {
            const { nombre, email, password, direccion } = req.body;

            if (!nombre || !email || !password) {
                console.log('VALIDACIÓN: Faltan datos (nombre, email o password).');
                return res.status(400).json({ mensaje: 'Todos los campos marcados son obligatorios.' });
            }

            console.log(`Verificando duplicados para: ${email}`);
            const existe = await Usuario.buscarPorEmail(email);
            if (existe) {
                console.log('El correo ya está en la base de datos.');
                return res.status(400).json({ mensaje: 'Este correo ya tiene una cuenta registrada.' });
            }

            const resultado = await Usuario.crear({ nombre, email, password, direccion });

            console.log('JUGADOR REGISTRADO. ID generado:', resultado.insertId);
            res.status(201).json({ exito: true, mensaje: '¡Bienvenido a la tienda de juegos!', id: resultado.insertId });

        } catch (error) {
            console.error('ERROR EN REGISTRO:', error.message);
            res.status(500).json({ mensaje: 'Error al procesar el registro.' });
        }
    },

    iniciarSesion: async (req, res) => {
        console.log('DEBUG: INTENTO DE LOGIN');
        const { email, password } = req.body;

        try {
            console.log(`Buscando al usuario: ${email}`);
            const usuario = await Usuario.buscarPorEmail(email);

            if (!usuario) {
                console.log('Usuario no encontrado en la base de datos.');
                return res.status(404).json({ mensaje: 'El correo no existe.' });
            }

            console.log('Comparando contraseñas directamente...');
            if (usuario.password !== password) {
                console.log('Contraseña incorrecta.');
                return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
            }

            console.log('LOGIN EXITOSO para:', usuario.nombre);
            res.json({ 
                exito: true, 
                mensaje: `¡Hola de nuevo, ${usuario.nombre}!`,
                usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email }
            });

        } catch (error) {
            console.error('ERROR EN LOGIN:', error.message);
            res.status(500).json({ mensaje: 'Error al iniciar sesión.' });
        }
    },

    actualizarPerfil: async (req, res) => {
        const { id } = req.params;
        console.log(`DEBUG: ACTUALIZANDO PERFIL ID: ${id}`);

        try {
            const resultado = await Usuario.actualizar(id, req.body);
            if (resultado.affectedRows > 0) {
                console.log('Cambios guardados en la base de datos.');
                res.json({ exito: true, mensaje: 'Perfil actualizado.' });
            } else {
                console.log('No se encontró el ID o los datos son iguales.');
                res.status(404).json({ mensaje: 'No se realizaron cambios.' });
            }
        } catch (error) {
            console.error('ERROR EN ACTUALIZACIÓN:', error.message);
            res.status(500).json({ mensaje: 'Error al actualizar.' });
        }
    }
};

export default controladorUsuario;