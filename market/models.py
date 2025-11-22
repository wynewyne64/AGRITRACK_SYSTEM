import uuid
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models
from Farmer.models import Farmer
from uuid import uuid4

class MarketProduct(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=[
        ('crop', 'Crop'),
        ('livestock', 'Livestock'),
        ('dairy', 'Dairy Product'),
        ('poultry', 'Poultry Product'),
        ('other', 'Other'),
    ])
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default="kg")
    available_quantity = models.FloatField(default=10, validators=[MinValueValidator(0)])
    date_added = models.DateField(auto_now_add=True)
    image = models.ImageField(upload_to="market_images/", blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.price_per_unit}/{self.unit}"

class Cart(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at=models.DateField(auto_now_add=True)

class CartItem(models.Model):
    cart=models.ForeignKey(
        Cart, on_delete=models.CASCADE, related_name='items')
    market=models.ForeignKey(MarketProduct,on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField()
    validators=[MinValueValidator(1)]

    class Meta:
        unique_together=[['cart','market']]



class Review(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    name=models.CharField(max_length=255)
    description=models.TextField()
    date=models.DateField(auto_now_add=True)

class Customer(models.Model):
    MEMBERSHIP_BRONZE='B'
    MEMBERSHIP_SILVER='S'
    MEMBERSHIP_GOLD='G'

    MEMBERSHIP_CHOICES=[
        (MEMBERSHIP_BRONZE, 'Bronze'),
        (MEMBERSHIP_SILVER, 'Silver'),
        (MEMBERSHIP_GOLD, 'Gold'),
    ]
    phone=models.CharField(max_length=255)
    birth_date=models.DateField(null=True, blank=True)
    membership=models.CharField(
        max_length=1, choices=MEMBERSHIP_CHOICES,default=MEMBERSHIP_BRONZE)
    user=models.OneToOneField(User, on_delete=models.CASCADE)

class Order(models.Model):
    PAYMENT_STATUS_PENDING='P'
    PAYMENT_STATUS_COMPLETE='C'
    PAYMENT_STATUS_FAILED='F'
    PAYMENT_STATUS_CHOICES=[
        (PAYMENT_STATUS_PENDING, 'Pending'),
        (PAYMENT_STATUS_COMPLETE, 'Complete'),
        (PAYMENT_STATUS_FAILED, 'Failed'),
    ]
    placed_at=models.DateTimeField(auto_now_add=True)
    payment_status=models.CharField(
        max_length=1,
        choices=PAYMENT_STATUS_CHOICES, default=PAYMENT_STATUS_PENDING)
    customer=models.ForeignKey(Customer, on_delete=models.CASCADE)

class OrderItem(models.Model):
    order=models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    market=models.ForeignKey(MarketProduct,on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField()
    price=models.DecimalField(max_digits=10, decimal_places=2)

