from django.contrib import admin
from . import models

@admin.register(models.Crop)
class CropAdmin(admin.ModelAdmin):
    list_display=('name','planting_date','expected_harvest_date','yield_estimate','status')
