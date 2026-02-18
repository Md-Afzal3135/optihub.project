from rest_framework import serializers
from .models import Cart, Order, OrderItem
from products.serializers import ProductSerializer


class CartSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'product', 'product_detail', 'quantity', 'total']

    def get_total(self, obj):
        return float(obj.product.price) * obj.quantity


class CartAddSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'total_price', 'status', 'address', 'items', 'created_at']


class PlaceOrderSerializer(serializers.Serializer):
    address = serializers.CharField()
