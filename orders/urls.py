from django.urls import path
from .views import CartListView, CartAddView, CartUpdateView, OrderListView, OrderDetailView

urlpatterns = [
    path('cart/', CartListView.as_view(), name='cart-list'),
    path('cart/add/', CartAddView.as_view(), name='cart-add'),
    path('cart/<int:pk>/', CartUpdateView.as_view(), name='cart-update'),
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
