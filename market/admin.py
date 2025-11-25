from django.contrib import admin
from . import models

@admin.register(models.MarketProduct)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ['Farmer','name','category','price_per_unit','unit','available_quantity','date_added']
    list_editable = ['price_per_unit','unit','available_quantity']



