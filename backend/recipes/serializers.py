from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient, Inventory, MealPlan, ShoppingList
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        # Use create_user to properly hash the password
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'unit']


class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = RecipeIngredient
        fields = ['id', 'ingredient', 'ingredient_id', 'amount']


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    ingredients_data = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'description', 'cooking_steps', 'image', 
                  'created_at', 'updated_at', 'ingredients', 'ingredients_data']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients_data', [])
        recipe = Recipe.objects.create(**validated_data)
        
        for ingredient_data in ingredients_data:
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient_id=ingredient_data['ingredient_id'],
                amount=ingredient_data['amount']
            )
        
        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients_data', None)
        
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.cooking_steps = validated_data.get('cooking_steps', instance.cooking_steps)
        instance.image = validated_data.get('image', instance.image)
        instance.save()

        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ingredient_data in ingredients_data:
                RecipeIngredient.objects.create(
                    recipe=instance,
                    ingredient_id=ingredient_data['ingredient_id'],
                    amount=ingredient_data['amount']
                )

        return instance


class InventorySerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Inventory
        fields = ['id', 'ingredient', 'ingredient_id', 'quantity', 'updated_at']


class MealPlanSerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer(read_only=True)
    recipe_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = MealPlan
        fields = ['id', 'recipe', 'recipe_id', 'date', 'meal_type', 'portions', 'created_at']


class ShoppingListSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ShoppingList
        fields = ['id', 'ingredient', 'ingredient_id', 'quantity', 'purchased', 'created_at']
