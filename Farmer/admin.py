from django.contrib import admin
from . import models

@admin.register(models.Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ['user','farm_name','location','farm_size','soil_type']
    list_editable = ['location','farm_size','soil_type']
    search_fields = ['user__username']

