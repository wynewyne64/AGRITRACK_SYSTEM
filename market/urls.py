from django.urls import path
from rest_framework.routers import SimpleRouter
from . import views
from .views import MarketViewSet, ReviewViewSet
from pprint import pprint
from rest_framework_nested import routers

router=routers.DefaultRouter()
router.register('markets', views.MarketViewSet)
router.register('carts', views.CartViewSet)
router.register('customers', views.CustomerViewSet)
router.register('orders', views.OrderViewSet, basename='orders')

market_router=routers.NestedDefaultRouter(router,'markets',lookup='market')
market_router.register('reviews', views.ReviewViewSet, basename='market-reviews')

carts_routers=routers.NestedDefaultRouter(router,'carts',lookup='cart')
carts_routers.register('items', views.CartItemViewSet,basename='cart-items')

urlpatterns=router.urls + market_router.urls + carts_routers.urls
