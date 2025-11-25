from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from rest_framework.templatetags.rest_framework import items
from .models import MarketProduct
from .models import Review
from .models import Cart
from .models import CartItem
from .models import Customer
from .models import Order
from .models import OrderItem


class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketProduct
        fields=['id','Farmer','name','category','price_per_unit','unit','available_quantity','date_added','image']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model= Review
        fields=['Farmer','name','description','date']

class SimpleMarketSerializer(serializers.ModelSerializer):
    class Meta:
        model=MarketProduct
        fields=['id','name','price_per_unit']

class CartItemSerializer(serializers.ModelSerializer):
    market=SimpleMarketSerializer()
    total_price=serializers.SerializerMethodField()

    def get_total_price(self, cart_item:CartItem):
        return cart_item.quantity*cart_item.market.price_per_unit

    class Meta:
        model = CartItem
        fields = ['id', 'market', 'quantity', 'total_price']


class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    items=CartItemSerializer(many=True, read_only=True)
    total_price=serializers.SerializerMethodField()


    def get_total_price(self, obj):
        return sum ([ item.market.price_per_unit *item.quantity for item in obj.items.all( )])

    class Meta:
        model=Cart
        fields=['id','items','total_price']


class AddCartItemSerializer(serializers.ModelSerializer):
    market_id=serializers.IntegerField()

    def validate_market_id(self, value):
        if not MarketProduct.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Invalid market ID")
        return value

    def save(self, **kwargs):
        cart_id=self.context['cart_id']
        market_id=self.validated_data['market_id']
        quantity=self.validated_data['quantity']

        try:
             cart_item=CartItem.objects.get(cart_id=cart_id,market_id=market_id)
             cart_item.quantity += quantity
             cart_item.save()
             self.instance = cart_item
        except CartItem.DoesNotExist:
            self.instance=CartItem.objects.create(cart_id=cart_id, **self.validated_data)

        return self.instance

    class Meta:
        model=CartItem
        fields=['id','market_id','quantity']

class UpdateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=CartItem
        fields=['quantity']

class CustomerSerializer(serializers.ModelSerializer):
    user_id=serializers.IntegerField(read_only=True)
    class Meta:
        model= Customer
        fields = ['id','user_id','phone','birth_date','membership']

class OrderItemSerializer(serializers.ModelSerializer):
    market=SimpleMarketSerializer()
    class Meta:
        model=OrderItem
        fields=['id','market','price','quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model=Order
        fields=['id','customer', 'placed_at','payment_status','items']

class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields=['payment_status']

class CreateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields=['cart_id']
    cart_id = serializers.UUIDField()

    def validate_cart_id(self, cart_id):
        if not Cart.objects.filter(pk=cart_id).exists():
            raise serializers.ValidationError("Invalid cart ID")
        if CartItem.objects.filter(cart_id=cart_id).count()==0:
            raise serializers.ValidationError('The Cart is empty')
        return cart_id


    def save(self, **kwargs):
     with transaction.atomic():
        cart_id=self.validated_data['cart_id']

        (customer, created)=Customer.objects.get_or_create(user_id=self.context['user_id'])
        order = Order.objects.create(customer=customer)

        cart_item = CartItem.objects\
                            .select_related('market')\
                            .filter(cart_id=cart_id)
        order_items=[
           OrderItem(
                order=order,
                market=item.market,
               price=item.market.price_per_unit,
               quantity=item.quantity,
            ) for item in cart_item
        ]
        OrderItem.objects.bulk_create(order_items)

        Cart.objects .filter(pk=cart_id).delete()

        return order