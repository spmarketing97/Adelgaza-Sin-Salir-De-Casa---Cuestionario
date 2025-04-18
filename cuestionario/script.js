document.addEventListener('DOMContentLoaded', function() {
    // Elementos principales
    const form = document.getElementById('questionnaire-form');
    const pages = document.querySelectorAll('.question-page');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const successMessage = document.getElementById('success-message');
    const countdownElement = document.getElementById('countdown');
    
    // Total de páginas y página actual
    const totalPages = pages.length;
    let currentPage = 1;
    
    // Inicialización
    updateProgressBar();
    
    // Botones de navegación
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentPage()) {
                goToPage(currentPage + 1);
            } else {
                // Si no se seleccionó ninguna opción, mostrar un mensaje
                alert('Por favor, selecciona al menos una opción para continuar');
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToPage(currentPage - 1);
        });
    });
    
    // Eventos para las opciones de radio y checkbox
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', function() {
            const parentOption = this.closest('.option');
            const otherOptions = parentOption.parentElement.querySelectorAll('.option');
            
            otherOptions.forEach(option => {
                option.classList.remove('selected');
            });
            
            parentOption.classList.add('selected');
        });
    });
    
    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateCurrentPage()) {
            // Recopilar todos los datos del formulario
            const formData = new FormData(form);
            sendFormData(formData);
        } else {
            alert('Por favor, completa todos los campos antes de enviar');
        }
    });
    
    // Evento para el checkbox de "Ninguno" en métodos
    const noneMethodCheckbox = document.getElementById('method-none');
    const otherMethodCheckboxes = document.querySelectorAll('input[name="methods"]:not(#method-none)');
    
    if (noneMethodCheckbox) {
        noneMethodCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherMethodCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                });
            } else {
                otherMethodCheckboxes.forEach(checkbox => {
                    checkbox.disabled = false;
                });
            }
        });
        
        otherMethodCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    noneMethodCheckbox.checked = false;
                }
            });
        });
    }
    
    // Funciones
    
    /**
     * Cambia a la página especificada
     * @param {number} pageNumber - Número de página a mostrar
     */
    function goToPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        
        // Ocultar página actual
        document.querySelector(`.question-page[data-page="${currentPage}"]`).classList.remove('active');
        
        // Mostrar nueva página
        currentPage = pageNumber;
        document.querySelector(`.question-page[data-page="${currentPage}"]`).classList.add('active');
        
        // Actualizar barra de progreso
        updateProgressBar();
    }
    
    /**
     * Actualiza la barra de progreso basada en la página actual
     */
    function updateProgressBar() {
        const progressPercentValue = Math.floor((currentPage - 1) / (totalPages - 1) * 100);
        progressBar.style.width = `${progressPercentValue}%`;
        progressPercentage.textContent = `${progressPercentValue}%`;
    }
    
    /**
     * Valida los campos de la página actual
     * Verifica que se haya seleccionado al menos una opción en cada grupo
     * @returns {boolean} - Verdadero si la página es válida
     */
    function validateCurrentPage() {
        const currentPageElement = document.querySelector(`.question-page[data-page="${currentPage}"]`);
        
        // Validar grupos de radio buttons
        const radioGroups = {};
        const radioInputs = currentPageElement.querySelectorAll('input[type="radio"]');
        
        radioInputs.forEach(input => {
            radioGroups[input.name] = radioGroups[input.name] || false;
            if (input.checked) {
                radioGroups[input.name] = true;
            }
        });
        
        // Verificar que al menos un radio button esté seleccionado en cada grupo
        for (const groupName in radioGroups) {
            if (!radioGroups[groupName]) {
                return false;
            }
        }
        
        // Validar grupos de checkboxes
        const checkboxGroups = {};
        const checkboxInputs = currentPageElement.querySelectorAll('input[type="checkbox"]');
        
        checkboxInputs.forEach(input => {
            checkboxGroups[input.name] = checkboxGroups[input.name] || false;
            if (input.checked) {
                checkboxGroups[input.name] = true;
            }
        });
        
        // Verificar que al menos un checkbox esté seleccionado en cada grupo
        for (const groupName in checkboxGroups) {
            if (!checkboxGroups[groupName] && checkboxInputs.length > 0) {
                return false;
            }
        }
        
        // Validar campos de texto y selects
        const textInputs = currentPageElement.querySelectorAll('input[type="text"], input[type="email"], select');
        
        for (let i = 0; i < textInputs.length; i++) {
            const input = textInputs[i];
            if (input.hasAttribute('required') && !input.value.trim()) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Envía los datos del formulario mediante AJAX
     * @param {FormData} formData - Datos del formulario
     */
    function sendFormData(formData) {
        // Mostrar un indicador de carga
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';
        
        // Preparar los datos para el correo
        const formDataObj = {};
        formData.forEach((value, key) => {
            // Manejar múltiples valores para checkboxes
            if (formDataObj[key]) {
                if (Array.isArray(formDataObj[key])) {
                    formDataObj[key].push(value);
                } else {
                    formDataObj[key] = [formDataObj[key], value];
                }
            } else {
                formDataObj[key] = value;
            }
        });
        
        // Convertir a formato de correo
        const emailData = {
            to: "hristiankrasimirov7@gmail.com",
            subject: "Adelgaza sin salir de casa - cuestionario",
            from: formDataObj.email || "contacto@adelgazasinsalirdecasa.com",
            nombre: formDataObj.nombre || "Usuario",
            edad: formDataObj.edad || "No especificado",
            genero: formDataObj.genero || "No especificado",
            data: JSON.stringify(formDataObj)
        };
        
        // Simular envío (reemplazar con tu API real)
        console.log("Enviando datos al correo:", emailData);
        
        // Aquí iría el código para enviar por AJAX a tu backend
        // Por ahora, simulamos una respuesta exitosa después de un tiempo
        setTimeout(() => {
            showSuccessMessage();
        }, 1500);
    }
    
    /**
     * Muestra el mensaje de éxito y comienza la cuenta regresiva
     */
    function showSuccessMessage() {
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        
        let secondsLeft = 3;
        
        // Iniciar cuenta regresiva
        const countdownInterval = setInterval(() => {
            secondsLeft--;
            countdownElement.textContent = secondsLeft;
            
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                // Redirigir a la página principal
                window.location.href = "../index.html";
            }
        }, 1000);
    }
    
    // Toggle para menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('active'));
        });
    }
});

// Script para el envío de correo usando EmailJS
(function() {
    // Cargar EmailJS SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = function() {
        // Inicializar EmailJS con tu clave pública
        emailjs.init("YOUR_PUBLIC_KEY"); // IMPORTANTE: Reemplazar con tu clave real
    };
})();

// Función para enviar correo con EmailJS
function sendEmail(formData) {
    return emailjs.send(
        'service_adelgaza', // ID del servicio
        'template_cuestionario', // ID de la plantilla
        formData,
        'YOUR_PUBLIC_KEY' // Tu clave pública
    );
} 