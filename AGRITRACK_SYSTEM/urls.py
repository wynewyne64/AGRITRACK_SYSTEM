from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

from Farmer.views import FarmerViewSet
from crops.views import CropViewSet
from finance.views import FinanceViewSet
from inventory.views import InventoryViewSet
from livestock.views import LivestockViewSet
from market.views import MarketViewSet

admin.site.site_header='AGRITRACK ADMIN'
admin.site.index_title='Admin'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('Farmer/',include('Farmer.urls')),
    path('crops/',include('crops.urls')),
    path('finance/', include('finance.urls')),
    path('inventory/', include('inventory.urls')),
    path('livestock/', include('livestock.urls')),
    path('market/', include('market.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("", include("core.urls")),


    path('Farmer/farmers/<int:pk>/', FarmerViewSet.as_view),
    path('crops/cropss/<int:pk>/', CropViewSet.as_view),
    path('finance/finances/<int:pk>/', FinanceViewSet.as_view),
    path('inventory/inventorys/<int:pk>/', InventoryViewSet.as_view),
    path('livestock/livestocks/<int:pk>/', LivestockViewSet.as_view),
    path('market/markets/<int:pk>/', MarketViewSet.as_view),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


