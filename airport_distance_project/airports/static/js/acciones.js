document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('airportForm');
    const resultadosDiv = document.getElementById('resultados');
    const errorDiv = document.getElementById('error');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpiar mensajes anteriores
        errorDiv.innerHTML = '';
        errorDiv.style.display = 'none';
        resultadosDiv.style.display = 'none';
        
        const formData = new FormData(form);
        
        fetch('/calcular/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mostrar datos del aeropuerto de origen
                document.getElementById('origen').textContent = data.aeropuerto_origen.codigo + ' - ' + data.aeropuerto_origen.nombre;
                document.getElementById('c_origen').textContent = data.aeropuerto_origen.ciudad;
                document.getElementById('p_origen').textContent = data.aeropuerto_origen.pais;
                document.getElementById('zona_horaria1').textContent = data.aeropuerto_origen.zona_horaria;
                
                // Mostrar datos del aeropuerto de destino
                document.getElementById('destino').textContent = data.aeropuerto_destino.codigo + ' - ' + data.aeropuerto_destino.nombre;
                document.getElementById('c_destino').textContent = data.aeropuerto_destino.ciudad;
                document.getElementById('p_destino').textContent = data.aeropuerto_destino.pais;
                document.getElementById('zona_horaria2').textContent = data.aeropuerto_destino.zona_horaria;
                
                // Mostrar distancia
                document.getElementById('distancia').textContent = parseFloat(data.distancia_km).toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                
                resultadosDiv.style.display = 'block';
            } else {
                errorDiv.innerHTML = `<p style="color: red; font-weight: bold;">${data.error}</p>`;
                errorDiv.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorDiv.innerHTML = `<p style="color: red; font-weight: bold;">Error de conexión. Por favor, inténtelo de nuevo.</p>`;
            errorDiv.style.display = 'block';
        });
    });
});