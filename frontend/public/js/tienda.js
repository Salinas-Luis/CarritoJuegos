
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

document.getElementById('form-editar').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    
    const idUsuario = localStorage.getItem('id_usuario');
    
    if (!idUsuario) {
        alert("Error: No se encontró el ID del usuario. Inicia sesión de nuevo.");
        return;
    }

    const datosActualizados = {
        nombre: document.getElementById('edit-nombre').value,
        direccion: document.getElementById('edit-direccion').value
    };

    try {
        const respuesta = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert("¡Datos actualizados con éxito!");
            localStorage.setItem('nombre_usuario', datosActualizados.nombre);
            cerrarModal();
            location.reload(); 
        } else {
            alert("Error: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

async function agregarAlCarrito(idProducto) {
    console.log("Añadiendo al carrito el producto:", idProducto);
    alert("Producto añadido al carrito");
}


let carrito = [];

function abrirCarrito() {
    document.getElementById('modalCarrito').style.display = 'block';
    renderizarCarrito();
}

function cerrarCarrito() {
    document.getElementById('modalCarrito').style.display = 'none';
}

function agregarAlCarrito(id, nombre, precio) {
    const juego = { id, nombre, precio };
    carrito.push(juego);
    actualizarContador();
    alert(`¡${nombre} añadido al carrito!`);
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