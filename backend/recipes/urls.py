from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views
from .views import (
    RecipeViewSet, IngredientViewSet, InventoryViewSet,
    MealPlanViewSet, ShoppingListViewSet, register
)

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'ingredients', IngredientViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'meal-plans', MealPlanViewSet)
router.register(r'shopping-list', ShoppingListViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('token/', jwt_views.TokenObtainPairView.as_view(),
                        name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(),
                        name='token_refresh')
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)