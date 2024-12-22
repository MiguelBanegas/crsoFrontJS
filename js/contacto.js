document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-centrado');

    form.addEventListener('submit', (event) => {
        // Prevenir el envío del formulario
        event.preventDefault();

        // Obtener los valores de los campos
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        // Validar los campos
        if (!nombre) {
            alert('Por favor, ingrese su nombre.');
            return;
        }

        if (!email) {
            alert('Por favor, ingrese su correo electrónico.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        if (!mensaje) {
            alert('Por favor, ingrese su mensaje.');
            return;
        }

        // Crear y mostrar el mensaje de envío
        const sendingMessage = `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}\n\nEnviando...`;
        const messageElement = document.createElement('div');
        messageElement.textContent = sendingMessage;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.backgroundColor = 'white';
        messageElement.style.padding = '20px';
        messageElement.style.border = '1px solid black';
        messageElement.style.zIndex = '1000';
        document.body.appendChild(messageElement);

        // Ocultar el mensaje y limpiar los campos del formulario después de 2 segundos
        setTimeout(() => {
            document.body.removeChild(messageElement);
            form.reset();
        }, 2000);
    });

    // Función para validar el formato del correo electrónico
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});