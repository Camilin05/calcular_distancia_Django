from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
# Create your views here.
def inicio(request):
    
    return render(request, 'inicio.html')

def calcular_distancia_html(requests):
    
    return render(requests, 'calcular_distancia.html')

@csrf_exempt
def calcular_distancia_api(request):
    if request.method == 'POST':
        try:
            aeropuerto_origen = request.POST.get('aeropuerto_origen', '').strip()
            aeropuerto_destino = request.POST.get('aeropuerto_destino', '').strip()
            
            if not aeropuerto_origen or not aeropuerto_destino:
                return JsonResponse({
                    'success': False,
                    'error': 'Debe ingresar ambos aeropuertos.',
                })
            
            if len(aeropuerto_origen) != 3 or  len(aeropuerto_destino) != 3:
                return JsonResponse({
                    'success': False,
                    'error': 'Los códigos IATA deben tener 3 caracteres.',
                })
            
            if aeropuerto_origen.upper() == aeropuerto_destino.upper():
                return JsonResponse({
                    'success': False,
                    'error': 'Los códigos IATA no pueden ser iguales.',
                })
            
            base_url = "https://airportgap.com/api/airports"
            
            datos_a = {
                "from": aeropuerto_origen,
                "to": aeropuerto_destino
                }
            
            respuesta_post = requests.post(f"{base_url}/distance", json=datos_a, timeout=10)
            
            if respuesta_post.status_code == 200:
                resultado = respuesta_post.json()
                
                resultado_datos = {
                    'success': True,
                    'codigo': resultado['data']['id'],
                    'distancia_km': resultado['data']['attributes']['kilometers'],
                    'aeropuerto_origen': {
                        'nombre': resultado['data']['attributes']['from_airport']['name'],
                        'ciudad': resultado['data']['attributes']['from_airport']['city'],
                        'pais':resultado['data']['attributes']['from_airport']['country'],
                        'zona_horaria':resultado['data']['attributes']['from_airport']['timezone'],
                        'codigo': aeropuerto_origen.upper()
                        },
                    'aeropuerto_destino': {
                        'nombre':resultado['data']['attributes']['to_airport']['name'],
                        'ciudad': resultado['data']['attributes']['to_airport']['city'],
                        'pais':resultado['data']['attributes']['to_airport']['country'],
                        'zona_horaria':resultado['data']['attributes']['to_airport']['timezone'],
                        'codigo': aeropuerto_destino.upper()
                        }
                }
                return JsonResponse(resultado_datos)
                
            elif respuesta_post.status_code == 422:
                return JsonResponse({
                    'success': False,
                    'error': 'Uno o ambos códigos IATA son inválidos.',
                })
            else:
                return JsonResponse({
                    'success': False,
                    'error': f'No se pudo obtener la distancia. Código de estado: {respuesta_post.status_code}',
                })
            
        except requests.exceptions.ConnectionError:
            return JsonResponse({
                'success': False,
                'error': 'ERROR DE CONEXIÓN, VERIFIQUE INTERNET E INTENTE NUEVAMENTE'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Error inesperado: {str(e)}'
            })
    return JsonResponse({
        'success': False,
        'error': 'Método no permitido'
    })