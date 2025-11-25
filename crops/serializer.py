from rest_framework import serializers
from .models import Crop
class CropSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    class Meta:
        model = Crop
        fields=['id','Farmer', 'name', 'planting_date','expected_harvest_date', 'yield_estimate','status', 'image']
