from django.contrib.auth.models import User
from django.db import models

class Farmer(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    farm_name=models.CharField(max_length=255)
    location=models.CharField(max_length=200)
    farm_size=models.FloatField(help_text='size in acres')
    soil_type=models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=100, unique=True, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    experience_years = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.farm_name



