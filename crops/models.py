from django.db import models
from Farmer.models import Farmer

class Crop(models.Model):
    farmer=models.ForeignKey(Farmer, on_delete=models.CASCADE)
    name=models.CharField(max_length=100)
    planting_date=models.DateField()
    expected_harvest_date=models.DateField()
    yield_estimate=models.FloatField(help_text='estimate yield in kg')
    status=models.CharField(max_length=50, choices=[
        ('planted','Planted'),
        ('growing','Growing'),
        ('harvested', 'Harvested'),
         ], default='planted')
    image = models.ImageField(upload_to='crop_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.farmer.farm_name})"


