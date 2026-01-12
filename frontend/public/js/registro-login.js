
function showForm(tipo) {
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');
    const mensajeDiv = document.getElementById('mensaje-error');

    mensajeDiv.textContent = ''; 

    if (tipo === 'login') {
        formLogin.classList.remove('hidden');
        formRegistro.classList.add('hidden');
        tabLogin.classList.add('active');
        tabRegistro.classList.remove('active');
    } else {
        formLogin.classList.add('hidden');
        formRegistro.classList.remove('hidden');
        tabLogin.classList.remove('active');
        tabRegistro.classList.add('active');
    }
}

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const mensajeDiv = document.getElementById('mensaje-error');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const resultado = await response.json();

            if (response.ok) {
                if (resultado.usuario) {
                    console.log("Guardando datos en localStorage:", resultado.usuario);
                    localStorage.setItem('id_usuario', resultado.usuario.id_usuario);
                    localStorage.setItem('nombre_usuario', resultado.usuario.nombre);
                }

                alert(resultado.mensaje || '¡Éxito!');
                window.location.href = '/tienda'; 
            } else {
                mensajeDiv.style.color = '#ff4444';
                mensajeDiv.textContent = resultado.mensaje;
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            mensajeDiv.textContent = 'Error al conectar con el servidor.';
        }
    });
});