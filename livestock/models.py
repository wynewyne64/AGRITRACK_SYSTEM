from django.db import models
from Farmer.models import Farmer

class Livestock(models.Model):
    farmer=models.ForeignKey(Farmer, on_delete=models.CASCADE)
    animal_type=models.CharField(max_length=100, choices=[
        ('cow', 'Cow'),
        ('goat', 'Goat'),
        ('chicken', 'Chicken'),
        ('sheep', 'Sheep'),
        ('other', 'Other'),
    ])
    breed=models.CharField(max_length=100, blank=True)
    number_of_animals=models.IntegerField(null=True, blank=True)
    health_status=models.CharField(max_length=100, default='Healthy')
    production=models.CharField(max_length=100, null=True, blank=True, help_text='e.g. litres of milk/cow or eggs per day')
    total_production=models.IntegerField(null=True, blank=True, help_text='Total production of litres of milk/day or eggs per day')

    def __str__(self):
        return f"{self.animal_type} ({self.farmer.farm_name})"


