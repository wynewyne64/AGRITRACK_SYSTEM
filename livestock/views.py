from django.shortcuts import render
from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Livestock
from rest_framework.decorators import api_view
from rest_framework.response import Response
from livestock.serializers import LivestockSerializer
from rest_framework import status

class LivestockViewSet(ModelViewSet):
    queryset = Livestock.objects.all()
    serializer_class = LivestockSerializer

    def get_serializer_context(self):
        return {'request':self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



