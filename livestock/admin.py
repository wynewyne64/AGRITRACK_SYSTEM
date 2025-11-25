from django.contrib import admin
from . import models

@admin.register(models.Livestock)
class FarmerAdmin(admin.ModelAdmin):
    list_display =['Farmer','animal_type','breed','number_of_animals','health_status','production','total_production']
    list_editable = ['health_status','production']
