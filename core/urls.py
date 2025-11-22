from django.urls import path
from .views import hello_view

urlpatterns = [
    path("api/hello/", hello_view),
]
