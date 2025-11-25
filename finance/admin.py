from django.contrib import admin
from . import models

@admin.register(models.Transaction)
class CropAdmin(admin.ModelAdmin):
    list_display=['Farmer','transaction_type','description','amount','date']
    list_editable=['amount']
