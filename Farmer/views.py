from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Farmer
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from Farmer.serializers import FarmerSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status

class FarmerViewSet(ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields=['user']
    search_fields=['farm_name']
    ordering_fields=['farm_size']


    def get_serializer_context(self):
        return {'request':self.request}

    def destroy(self, request, pk=None):
        try:
            farmer = Farmer.objects.get(pk=pk)
            farmer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Farmer.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class TestViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({"message": "Hello from Django backend!"})









