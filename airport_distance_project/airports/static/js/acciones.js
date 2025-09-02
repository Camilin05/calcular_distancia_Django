document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('airportForm');
    const resultadosDiv = document.getElementById('resultados');
    const errorDiv = document.getElementById('error');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Función para mostrar loading en el botón
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    }
    
    // Función para mostrar errores
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        resultadosDiv.classList.remove('show');
        
        // Ocultar error después de 5 segundos
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }
    
    // Función para mostrar resultados
    function showResults(origen, c_origen, p_origen, zona_horaria1, destino, c_destino, p_destino, zona_horaria2, distancia) {
        document.getElementById('origen').textContent = origen;
        document.getElementById('c_origen').textContent = c_origen;
        document.getElementById('p_origen').textContent = p_origen;
        document.getElementById('zona_horaria1').textContent = zona_horaria1;
        document.getElementById('destino').textContent = destino;
        document.getElementById('c_destino').textContent = c_destino;
        document.getElementById('p_destino').textContent = p_destino;
        document.getElementById('zona_horaria2').textContent = zona_horaria2;
        document.getElementById('distancia').textContent = distancia;
        
        errorDiv.classList.remove('show');
        resultadosDiv.classList.add('show');
        
        // Scroll suave hacia los resultados
        resultadosDiv.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    // Validación de códigos de aeropuerto
    function validateAirportCode(code) {
        const regex = /^[A-Z]{3}$/;
        return regex.test(code.toUpperCase());
    }
    
    // Auto-formatear códigos de aeropuerto
    const airportInputs = document.querySelectorAll('input[type="text"]');
    airportInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        });
        
        // Efecto de focus mejorado
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const origen = document.getElementById('aeropuerto_origen').value.trim().toUpperCase();
        const destino = document.getElementById('aeropuerto_destino').value.trim().toUpperCase();
        
        // Validaciones
        if (!validateAirportCode(origen)) {
            showError('El código de aeropuerto de origen debe tener exactamente 3 letras (ej: BAQ)');
            return;
        }
        
        if (!validateAirportCode(destino)) {
            showError('El código de aeropuerto de destino debe tener exactamente 3 letras (ej: MEX)');
            return;
        }
        
        if (origen === destino) {
            showError('El aeropuerto de origen y destino no pueden ser el mismo');
            return;
        }
        
        // Mostrar loading
        setLoading(true);
        
        try {
            // Aquí iría la llamada a tu API
            // Por ahora simulo una respuesta
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulación de cálculo de distancia (reemplaza con tu lógica real)
            const distanciaSimulada = Math.random() * 5000 + 500;
            
            showResults(origen, destino, distanciaSimulada);
            
        } catch (error) {
            showError('Error al calcular la distancia. Por favor, intenta de nuevo.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    });
    
    // Efecto de typing para placeholders
    function animatePlaceholder(input, text) {
        let i = 0;
        const originalPlaceholder = input.placeholder;
        
        input.addEventListener('focus', function() {
            if (this.value === '') {
                this.placeholder = '';
                const typeInterval = setInterval(() => {
                    this.placeholder += text[i];
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeInterval);
                    }
                }, 100);
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.placeholder = originalPlaceholder;
                i = 0;
            }
        });
    }
    
    // Aplicar animación de placeholder
    const origenInput = document.getElementById('aeropuerto_origen');
    const destinoInput = document.getElementById('aeropuerto_destino');
    
    animatePlaceholder(origenInput, 'BAQ');
    animatePlaceholder(destinoInput, 'MEX');
});