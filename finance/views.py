from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from finance.serializers import FinanceSerializer
from rest_framework import status

class FinanceViewSet(ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = FinanceSerializer

    def get_serializer_context(self):
        return {'request':self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
