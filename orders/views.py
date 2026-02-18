from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Cart, Order, OrderItem
from products.models import Product
from .serializers import CartSerializer, CartAddSerializer, OrderSerializer, PlaceOrderSerializer


class CartListView(APIView):
    """Get user's cart items."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart_items = Cart.objects.filter(user=request.user).select_related('product', 'product__category')
        serializer = CartSerializer(cart_items, many=True)
        total = sum(item['total'] for item in serializer.data)
        return Response({'items': serializer.data, 'cart_total': total})


class CartAddView(APIView):
    """Add item to cart or update quantity."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CartAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = Cart.objects.get_or_create(
            user=request.user, product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(CartSerializer(cart_item).data, status=status.HTTP_200_OK)


class CartUpdateView(APIView):
    """Update or delete a cart item."""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            cart_item = Cart.objects.get(id=pk, user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity and int(quantity) > 0:
            cart_item.quantity = int(quantity)
            cart_item.save()
            return Response(CartSerializer(cart_item).data)

        return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            cart_item = Cart.objects.get(id=pk, user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)


class OrderListView(APIView):
    """List user's orders or place a new order."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart_items = Cart.objects.filter(user=request.user).select_related('product')
        if not cart_items.exists():
            return Response({'error': 'Your cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(item.product.price * item.quantity for item in cart_items)

        order = Order.objects.create(
            user=request.user,
            total_price=total,
            address=serializer.validated_data['address'],
        )

        order_items = []
        for item in cart_items:
            order_items.append(OrderItem(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_price=item.product.price,
                quantity=item.quantity,
            ))
        OrderItem.objects.bulk_create(order_items)

        cart_items.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    """Get order detail."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.prefetch_related('items').get(id=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(OrderSerializer(order).data)
