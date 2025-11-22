from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from . import views
urlpatterns = [
    path('token/',
         jwt_views.TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/',
         jwt_views.TokenRefreshView.as_view(),
         name='token_refresh'),
     path('signup/', views.signup, name='signup'),
     # path('fridge/weight', views.get_fridge_product_weight, name='fridge_product_weight'),
     path('fridge/weight', views.get_all_fridge_weights, name='all_fridge_weights')
]