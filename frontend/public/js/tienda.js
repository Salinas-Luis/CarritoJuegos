
document.addEventListener('DOMContentLoaded', () => {
    console.log("CARGA INICIAL: Recuperando carrito de la BD");
    cargarCarritoDesdeBD();
});


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
    modal.style.display = 'block';

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
    const juegos = document.querySelectorAll('.card');

    juegos.forEach(juego => {
        const titulo = juego.querySelector('h3').innerText.toLowerCase();
        const precioTexto = juego.querySelector('.precio').innerText.replace('$', '');
        const precio = parseFloat(precioTexto);

        const coincideNombre = titulo.includes(textoBusqueda);

        let coincidePrecio = false;
        if (rangoPrecio === 'todos') {
            coincidePrecio = true;
        } else if (rangoPrecio === 'gratis') {
            coincidePrecio = (precio === 0);
        } else if (rangoPrecio === 'bajo') {
            coincidePrecio = (precio > 0 && precio < 30);
        } else if (rangoPrecio === 'medio') {
            coincidePrecio = (precio >= 30 && precio <= 60);
        } else if (rangoPrecio === 'alto') {
            coincidePrecio = (precio > 60);
        }

        if (coincideNombre && coincidePrecio) {
            juego.style.display = "flex";
        } else {
            juego.style.display = "none";
        }
    });
}