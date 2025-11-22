from rest_framework import serializers
from .models import Transaction
class FinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields=['id','farmer','transaction_type','description','amount','date']
