from django.contrib import admin
from . import models

@admin.register(models.InventoryItem)
class FarmerAdmin(admin.ModelAdmin):
    list_display=['farmer','name','category','quantity','unit','date_added','quantity_status']
    list_editable=['quantity','unit']

    @admin.display(ordering='quantity')
    def quantity_status(self,obj):
        if obj.quantity<10:
            return 'Low Stock'
        return 'In Stock'



