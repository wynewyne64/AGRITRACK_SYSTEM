from django_filters.rest_framework import FilterSet
from .models import Farmer

class FarmerFilter(FilterSet):
    class Meta:
        model=Farmer
        fields={
            'user':['exact']

        }