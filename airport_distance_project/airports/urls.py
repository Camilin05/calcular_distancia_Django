from django.urls import path
from . import views


app_name = "airports"

urlpatterns = [
    path("", views.inicio, name="inicio"),
    path("/calcular_distancia", views.calcular_distancia_html, name="calcular_distancia"),
    path("calcular/", views.calcular_distancia_api, name="calcular_distancia_api"),
    
]