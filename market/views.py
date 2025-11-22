from django.shortcuts import render
from django.shortcuts import render
from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, DjangoModelPermissions
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, DestroyModelMixin, \
    UpdateModelMixin
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import CreateModelMixin
from .models import MarketProduct
from rest_framework.decorators import api_view
from rest_framework.response import Response
from market.serializers import MarketSerializer, CartSerializer, CartItemSerializer, AddCartItemSerializer, \
    UpdateCartItemSerializer, OrderItemSerializer, UpdateOrderSerializer
from rest_framework import status
from market.serializers import Review
from market.serializers import ReviewSerializer
from market.serializers import CustomerSerializer
from market.serializers import OrderSerializer
from market.serializers import CreateOrderSerializer
from market.serializers import OrderItemSerializer
from market.models import Cart
from market.models import CartItem
from market.models import Customer
from market.models import Order
from .permissions import IsAdminOrReadOnly, FullDjangoModelPermissions
from rest_framework.permissions import AllowAny
from .permissions import ReadOnly

class MarketViewSet(ModelViewSet):
    queryset = MarketProduct.objects.all()
    serializer_class = MarketSerializer
    permission_classes = [ReadOnly]

    def get_serializer_context(self):
        return {'request':self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ReviewViewSet(ModelViewSet):
    queryset=Review.objects.all()
    serializer_class = ReviewSerializer

class CartViewSet( CreateModelMixin,
                   RetrieveModelMixin,
                   DestroyModelMixin,
                   GenericViewSet):
    queryset=Cart.objects.all()
    serializer_class=CartSerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

class CartItemViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'patch','put', 'delete']

    def get_serializer_class(self):
        if self.request.method =='POST':
            return AddCartItemSerializer
        elif self.request.method =='PATCH':
            return UpdateCartItemSerializer
        return CartItemSerializer


    def get_serializer_context(self):
        return{'cart_id':self.kwargs['cart_pk']}


    def get_queryset(self):
        return (CartItem.objects\
                .filter(cart_id=self.kwargs['cart_pk']))\
                .select_related('market')

class CustomerViewSet(ModelViewSet):
    queryset=Customer.objects.all()
    serializer_class=CustomerSerializer
    permission_classes = [FullDjangoModelPermissions]

    def get_permissions(self):
        if self.request.method =='GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['GET','PUT'],permission_classes=[IsAuthenticated])
    def me(self, request):
        (customer, created) = Customer.objects.get_or_create(user=request.user.id)
        if request.method == 'GET':
           serializer=CustomerSerializer(customer)
           return Response(serializer.data)
        elif request.method =='PUT':
            serializer =CustomerSerializer(customer, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class OrderViewSet(ModelViewSet):
    http_method_names = ['get','post','patch','delete','head','options']

    def get_permissions(self):
        if self.request.method in ['PATCH','DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def create(self,request,*args,**kwargs):
        serializer=CreateOrderSerializer(
            data=request.data,
            context={'user_id':self.request.user.id})
        serializer.is_valid(raise_exception=True)
        order=serializer.save()
        serializer=OrderSerializer(order)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.request.method =='POST':
            return CreateOrderSerializer
        elif self.request.method =='PATCH':
            return UpdateOrderSerializer
        return OrderSerializer



    def get_queryset(self):
        user=self.request.user
        if user.is_staff:
            return Order.objects.all()

        (customer_id, created)=Customer.objects.only(
            'id').get_or_create(user=self.request.user.id)
        return Order.objects.filter(customer_id=customer_id)



class OrderItemViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderItemSerializer


