from django.urls import path
from django.urls import include
from rest_framework.routers import SimpleRouter, DefaultRouter
from . import views
from pprint import pprint
from .views import TestViewSet

router=DefaultRouter()
router.register(r'farmers', views.FarmerViewSet)
router.register(r'test', TestViewSet, basename='test')

pprint(router.urls)
urlpatterns = router.urls
