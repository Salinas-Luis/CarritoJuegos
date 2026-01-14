
    document.addEventListener('DOMContentLoaded', () => {
        console.log("CARGA INICIAL: Recuperando carrito de la BD");
        setTimeout(() => {
                cargarCarritoDesdeBD();
                verificarPermisosAdmin();
            }, 100);
    });

    function verificarPermisosAdmin() {
        const rol = localStorage.getItem('rol_usuario');
        console.log("Verificando rol para interfaz:", rol);

        if (rol === 'admin') {
            const navActions = document.querySelector('.nav-actions');
            if (navActions && !document.getElementById('btn-nuevo-juego')) {
                const btnAdmin = document.createElement('button');
                btnAdmin.id = 'btn-nuevo-juego';
                btnAdmin.className = 'btn-primary';
                btnAdmin.style.background = '#e67e22'; 
                btnAdmin.innerText = '+ Agregar Juego';
                btnAdmin.onclick = () => abrirModalNuevoJuego();
                navActions.prepend(btnAdmin);
            }

            const tarjetas = document.querySelectorAll('.card');
            tarjetas.forEach(tarjeta => {
                const idProducto = tarjeta.getAttribute('data-id');
                const contenedorAdmin = tarjeta.querySelector('.admin-controls-container');

                if (contenedorAdmin) {
                    contenedorAdmin.innerHTML = `
                        <div style="display: flex; gap: 5px; margin-bottom: 10px; border-top: 1px solid #333; padding-top: 10px;">
                            <button class="btn-warning-sm" style="flex: 1;" onclick="prepararEdicion('${idProducto}')"> Editar</button>
                            <button class="btn-danger-sm" style="flex: 1;" onclick="eliminarJuego('${idProducto}')"> Borrar</button>
                        </div>
                    `;
                }
            });
        }
    }

    function abrirModalNuevoJuego() {
        document.getElementById('modalTitulo').innerText = "Nuevo Juego";
        document.getElementById('form-juego').reset();
        document.getElementById('juego-id').value = ""; 
        document.getElementById('modalJuego').style.display = 'flex';
    }

    function cerrarModalJuego() {
        document.getElementById('modalJuego').style.display = 'none';
    }

    async function guardarJuego() {
        try {
            const elId = document.getElementById('juego-id');
            const elNombre = document.getElementById('juego-nombre');
            const elPrecio = document.getElementById('juego-precio');
            const elGenero = document.getElementById('juego-genero');
            const elDesc = document.getElementById('juego-descripcion');

            if (!elNombre || !elPrecio || !elGenero || !elDesc) {
                console.error("Faltan elementos en el DOM");
                return;
            }

            const id = elId.value;
            const nombre = elNombre.value.trim();
            const precio = elPrecio.value;
            const genero = elGenero.value;
            const descripcion = elDesc.value.trim();

            if (nombre.length < 3) return alert("El nombre debe tener al menos 3 letras.");
            if (precio === "" || parseFloat(precio) < 0) return alert("Ingresa un precio válido.");
            if (descripcion.length < 10) return alert("La descripción debe ser más detallada.");

            const datos = { 
                nombre, 
                precio: parseFloat(precio), 
                genero, 
                descripcion 
            };

            const url = id ? `/api/productos/${id}` : '/api/productos';
            const metodo = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (res.ok) {
                alert("¡Cambios guardados con éxito!");
                location.reload();
            } else {
                const err = await res.json();
                alert("Error: " + err.mensaje);
            }

        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Hubo un fallo al conectar con el servidor.");
        }
    }

async function eliminarJuego(id) {
    if (!confirm("¿Seguro que quieres borrar este juego?")) return;

    try {
        const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert("Juego eliminado.");
            location.reload();
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

async function cargarCarritoDesdeBD() {
    const id_usuario = localStorage.getItem('id_usuario');
    
    if (!id_usuario) return; 

    try {
        const response = await fetch(`/api/carrito/usuario/${id_usuario}`);
        const resultado = await response.json();

        console.log("Datos recuperados:", resultado);

        if (response.ok && resultado.exito) {
            carrito = resultado.productos.map(p => ({
                id_producto: p.id_producto,
                nombre: p.nombre,
                precio: parseFloat(p.precio),
                cantidad: p.cantidad
            }));

            actualizarInterfazCarrito();
            console.log("Interfaz sincronizada con la base de datos.");
        }
    } catch (error) {
        console.error("Error al cargar carrito inicial:", error);
    }
}

function cerrarSesion() {
    alert("Cerrando sesión... ¡Vuelve pronto!");
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('nombre_usuario');
    window.location.href = '/';
}

function abrirModal() {
    const modal = document.getElementById('modalConfiguracion');
    modal.style.display = 'flex';

    const nombreGuardado = localStorage.getItem('nombre_usuario');
    if (nombreGuardado) {
        document.getElementById('edit-nombre').value = nombreGuardado;
    }
}

function cerrarModal() {
    document.getElementById('modalConfiguracion').style.display = 'none';
}

let carrito = [];

function abrirCarrito() {
    document.getElementById('modalCarrito').style.display = 'block';
    renderizarCarrito();
}

function cerrarCarrito() {
    document.getElementById('modalCarrito').style.display = 'none';
}

async function agregarAlCarrito(id_producto, nombre, precio) {
    console.log("DEBUG FRONTEND");
    console.log("1. Dato extraído (ID):", id_producto);
    console.log("2. Dato extraído (Nombre):", nombre);
    console.log("3. Dato extraído (Precio):", precio);

    const id_usuario = localStorage.getItem('id_usuario');
    console.log("4. ID Usuario desde localStorage:", id_usuario);

    if (!id_usuario) {
        console.warn("VALIDACIÓN: No hay id_usuario. El usuario no ha iniciado sesión.");
        alert("Inicia sesión para guardar tu carrito.");
        return;
    }

    try {
        const bodyEnvio = {
            id_usuario: parseInt(id_usuario),
            id_producto: parseInt(id_producto),
            cantidad: 1
        };
        console.log("5. Cuerpo del JSON a enviar:", bodyEnvio);

        const response = await fetch('/api/carrito/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyEnvio)
        });

        console.log("6. Status de la respuesta fetch:", response.status);

        const resultado = await response.json();
        console.log("7. Resultado JSON recibido del servidor:", resultado);

        if (response.ok && resultado.exito) {
            alert("Producto agregado al carrito correctamente")
            carrito.push({ id_producto, nombre, precio: parseFloat(precio) });
            actualizarInterfazCarrito();
            console.log("ÉXITO: Producto sincronizado con DB.");
        }
    } catch (error) {
        console.error("ERROR FATAL en la petición fetch:", error);
    }
}

function actualizarContador() {
    document.getElementById('contador-carrito').innerText = carrito.length;
}

function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const txtTotal = document.getElementById('precio-total');
    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="color: var(--texto-tenue);">Aún no tienes juegos en tu carrito.</p>';
        txtTotal.innerText = "$0.00";
        return;
    }

    contenedor.innerHTML = '';
    carrito.forEach((juego, index) => {
        total += parseFloat(juego.precio);
        contenedor.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: #252525; padding: 10px; border-radius: 8px;">
                <span>${juego.nombre}</span>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="color: #2ecc71; font-weight: bold;">$${juego.precio}</span>
                    <button class="btn-danger-sm" onclick="eliminarDelCarrito(${index})">X</button>
                </div>
            </div>
        `;
    });
    txtTotal.innerText = `$${total.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
    actualizarContador();
}

function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
    actualizarContador();
}

async function procesarCompra() {
    const id_usuario = localStorage.getItem('id_usuario');

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    try {
        const response = await fetch('/api/ventas/finalizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario })
        });

        const resultado = await response.json();

        if (response.ok && resultado.exito) {
            alert(resultado.mensaje);

            carrito = []; 
            
            renderizarCarrito(); 
            actualizarContador();
            cerrarCarrito(); 
            
            console.log("Interfaz limpia: Compra completada con éxito.");
        }
    } catch (error) {
        console.error("Error al procesar compra:", error);
    }
}

async function validarYEnviarPerfil() {
    console.log("BOTÓN PRESIONADO: VALIDANDO");

    const inputNombre = document.getElementById('edit-nombre');
    const inputDireccion = document.getElementById('edit-direccion');
    const idUsuario = localStorage.getItem('id_usuario');

    const nombre = inputNombre.value.trim();
    const direccion = inputDireccion.value.trim();

    console.log("Nombre:", nombre, "Longitud:", nombre.length);

    if (nombre.length < 12) {
        console.error("VALIDACIÓN FALLIDA");
        alert("El nombre debe tener al menos 12 caracteres.");
        inputNombre.focus();
        return; 
    }
    if (!direccion) {
        alert("La dirección de envío es obligatoria para poder procesar tus pedidos.");
        return; 
    }

    if (direccion.length < 10) {
        alert("Por favor, ingresa una dirección más completa (Calle, Número, Ciudad).");
        return;
    }

    try {
        const respuesta = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, direccion })
        });

        if (respuesta.ok) {
            alert("¡ÉXITO! Datos guardados correctamente.");
            localStorage.setItem('nombre_usuario', nombre);
            cerrarModal();
            location.reload();
        }
    } catch (error) {
        console.error("Error fatal:", error);
    }
}

function filtrarJuegos() {
    const textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    const juegos = document.querySelectorAll('.card');

    juegos.forEach(juego => {
        const titulo = juego.querySelector('h3').innerText.toLowerCase();
        if (titulo.includes(textoBusqueda)) {
            juego.style.display = "flex";
        } else {
            juego.style.display = "none";
        }
    });
}

function filtrarCatalogo() {
    const textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    const rangoPrecio = document.getElementById('filtro-precio').value;
    const generoSeleccionado = document.getElementById('filtro-genero').value;
    
    const juegos = document.querySelectorAll('.card');

    juegos.forEach(juego => {
        const titulo = juego.querySelector('h3').innerText.toLowerCase();
        const generoJuego = juego.getAttribute('data-genero');
        const precio = parseFloat(juego.querySelector('.precio').innerText.replace(/[^0-9.]/g, ''));

        const coincideNombre = titulo.includes(textoBusqueda);

        const coincideGenero = (generoSeleccionado === 'todos' || generoJuego === generoSeleccionado);

        let coincidePrecio = false;
        if (rangoPrecio === 'todos') coincidePrecio = true;
        else if (rangoPrecio === 'gratis') coincidePrecio = (precio === 0);
        else if (rangoPrecio === 'bajo') coincidePrecio = (precio > 0 && precio < 400);
        else if (rangoPrecio === 'medio') coincidePrecio = (precio >= 400 && precio <= 1000);
        else if (rangoPrecio === 'alto') coincidePrecio = (precio > 1000);

        if (coincideNombre && coincideGenero && coincidePrecio) {
            juego.style.display = "flex";
        } else {
            juego.style.display = "none";
        }
    });
}

function prepararEdicion(id) {
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (!card) return;

    document.getElementById('juego-id').value = id;
    document.getElementById('juego-nombre').value = card.querySelector('h3').innerText;
    document.getElementById('juego-precio').value = card.querySelector('.precio').innerText.replace(/[^0-9.]/g, '');
    document.getElementById('juego-genero').value = card.getAttribute('data-genero');
    document.getElementById('juego-descripcion').value = card.querySelector('p').innerText;

    document.getElementById('modalTitulo').innerText = "Editar Juego";
    document.getElementById('modalJuego').style.display = 'flex';
}
