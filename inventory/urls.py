from django.urls import path
from rest_framework.routers import SimpleRouter
from . import views
from pprint import pprint

router=SimpleRouter()
router.register('inventorys', views.InventoryViewSet)
pprint(router.urls)
urlpatterns=router.urls