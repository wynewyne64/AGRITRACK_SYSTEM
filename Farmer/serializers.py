from rest_framework import serializers
from .models import Farmer
class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields=['id','user', 'farm_name', 'location', 'farm_size', 'soil_type','email',          # 🆕
            'address', 'experience_years']



