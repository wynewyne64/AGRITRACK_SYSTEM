from django.urls import path
from rest_framework.routers import SimpleRouter
from . import views
from pprint import pprint
from django.conf import settings
from django.conf.urls.static import static

router=SimpleRouter()
router.register('cropss', views.CropViewSet)
pprint(router.urls)
urlpatterns=router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)