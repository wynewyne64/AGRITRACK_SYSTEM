from rest_framework import serializers
from .models import Livestock
class LivestockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livestock
        fields=['id','farmer','animal_type','breed','number_of_animals','health_status','production','total_production']
