from django.urls import path
from rest_framework.routers import SimpleRouter
from . import views
from pprint import pprint

router=SimpleRouter()
router.register('finances', views.FinanceViewSet)
pprint(router.urls)
urlpatterns=router.urls
