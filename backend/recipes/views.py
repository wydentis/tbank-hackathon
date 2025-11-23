from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F
from datetime import datetime, timedelta
from .models import Recipe, Ingredient, Inventory, MealPlan, ShoppingList
from .serializers import (
    RecipeSerializer, IngredientSerializer, InventorySerializer,
    MealPlanSerializer, ShoppingListSerializer
)


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

    @action(detail=False, methods=['post'])
    def update_inventory(self, request):
        """Обновление запасов продуктов"""
        ingredient_id = request.data.get('ingredient_id')
        quantity = request.data.get('quantity')

        try:
            inventory, created = Inventory.objects.get_or_create(
                ingredient_id=ingredient_id,
                defaults={'quantity': quantity}
            )
            if not created:
                inventory.quantity = quantity
                inventory.save()

            serializer = self.get_serializer(inventory)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')

        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        return queryset


class ShoppingListViewSet(viewsets.ModelViewSet):
    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    @action(detail=False, methods=['post'])
    def generate_from_meal_plan(self, request):
        """Генерация списка покупок на основе плана питания"""
        date_from = request.data.get('date_from')
        date_to = request.data.get('date_to')

        if not date_from or not date_to:
            return Response(
                {'error': 'Необходимо указать date_from и date_to'},
                status=status.HTTP_400_BAD_REQUEST
            )

        meal_plans = MealPlan.objects.filter(
            date__range=[date_from, date_to]
        ).select_related('recipe')

        required_ingredients = {}
        for meal in meal_plans:
            for recipe_ingredient in meal.recipe.ingredients.all():
                ingredient_id = recipe_ingredient.ingredient.id
                amount = recipe_ingredient.amount * meal.portions

                if ingredient_id in required_ingredients:
                    required_ingredients[ingredient_id] += amount
                else:
                    required_ingredients[ingredient_id] = amount

        # Вычитаем доступные запасы
        shopping_items = []
        for ingredient_id, required_amount in required_ingredients.items():
            try:
                inventory = Inventory.objects.get(ingredient_id=ingredient_id)
                available = inventory.quantity
            except Inventory.DoesNotExist:
                available = 0

            needed = required_amount - available
            if needed > 0:
                shopping_items.append({
                    'ingredient_id': ingredient_id,
                    'quantity': needed,
                    'purchased': False
                })

        # Очищаем старый список и создаем новый
        ShoppingList.objects.all().delete()
        shopping_list = [ShoppingList(**item) for item in shopping_items]
        ShoppingList.objects.bulk_create(shopping_list)

        serializer = self.get_serializer(
            ShoppingList.objects.all(), many=True
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def suggest_recipes(self, request):
        """Подбор рецептов по доступным ингредиентам"""
        available_ingredients = set(
            Inventory.objects.filter(quantity__gt=0)
            .values_list('ingredient_id', flat=True)
        )

        recipes = Recipe.objects.prefetch_related('ingredients__ingredient')
        suggestions = []

        for recipe in recipes:
            recipe_ingredients = set(
                recipe.ingredients.values_list('ingredient_id', flat=True)
            )
            
            # Проверяем, есть ли все необходимые ингредиенты
            if recipe_ingredients.issubset(available_ingredients):
                # Проверяем количество
                can_make = True
                for recipe_ingredient in recipe.ingredients.all():
                    try:
                        inventory = Inventory.objects.get(
                            ingredient_id=recipe_ingredient.ingredient_id
                        )
                        if inventory.quantity < recipe_ingredient.amount:
                            can_make = False
                            break
                    except Inventory.DoesNotExist:
                        can_make = False
                        break

                if can_make:
                    suggestions.append(recipe)

        serializer = RecipeSerializer(suggestions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_purchased(self, request, pk=None):
        """Отметить продукт как купленный"""
        shopping_item = self.get_object()
        shopping_item.purchased = True
        shopping_item.save()
        
        serializer = self.get_serializer(shopping_item)
        return Response(serializer.data)
