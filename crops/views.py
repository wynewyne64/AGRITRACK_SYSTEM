from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Crop
from rest_framework.decorators import api_view
from rest_framework.response import Response
from crops.serializer import CropSerializer
from rest_framework import status

class CropViewSet(ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer

    def get_serializer_context(self):
        return {'request':self.request}

    def delete(self, request, pk):
        Crop.delete()
        return Response(status.HTTP_204_NO_CONTENT)
