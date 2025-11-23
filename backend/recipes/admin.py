from django.contrib import admin
from .models import Recipe, Ingredient, RecipeIngredient, Inventory, MealPlan, ShoppingList


class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'updated_at']
    search_fields = ['name', 'description']
    inlines = [RecipeIngredientInline]


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ['name', 'unit']
    search_fields = ['name']


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['ingredient', 'quantity', 'updated_at']
    search_fields = ['ingredient__name']


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ['date', 'meal_type', 'recipe', 'portions']
    list_filter = ['date', 'meal_type']
    search_fields = ['recipe__name']


@admin.register(ShoppingList)
class ShoppingListAdmin(admin.ModelAdmin):
    list_display = ['ingredient', 'quantity', 'purchased', 'created_at']
    list_filter = ['purchased']
    search_fields = ['ingredient__name']
