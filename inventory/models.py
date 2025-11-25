from django.db import models
from Farmer.models import Farmer

class InventoryItem(models.Model):
    Farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=[
        ('seed', 'Seed'),
        ('fertilizer', 'Fertilizer'),
        ('pesticide', 'Pesticide'),
        ('equipment', 'Equipment'),
        ('feed', 'Animal Feed'),
        ('other', 'Other'),
    ])
    quantity = models.FloatField()
    unit = models.CharField(max_length=20, default="kg")
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

