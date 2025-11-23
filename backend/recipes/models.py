from django.db import models


class Recipe(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название рецепта")
    description = models.TextField(blank=True, verbose_name="Описание")
    cooking_steps = models.TextField(verbose_name="Шаги приготовления")
    image = models.URLField(blank=True, null=True, verbose_name="Изображение")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Рецепт"
        verbose_name_plural = "Рецепты"
        ordering = ['created_at']

    def __str__(self):
        return self.name


class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Название")
    unit = models.CharField(max_length=50, verbose_name="Единица измерения")

    class Meta:
        verbose_name = "Ингредиент"
        verbose_name_plural = "Ингредиенты"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.unit})"


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Количество")

    class Meta:
        verbose_name = "Ингредиент рецепта"
        verbose_name_plural = "Ингредиенты рецепта"
        unique_together = ['recipe', 'ingredient']

    def __str__(self):
        return f"{self.ingredient.name} - {self.amount} {self.ingredient.unit}"


class Inventory(models.Model):
    ingredient = models.OneToOneField(Ingredient, on_delete=models.CASCADE, related_name='inventory')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Количество в наличии")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Запасы"
        verbose_name_plural = "Запасы"

    def __str__(self):
        return f"{self.ingredient.name}: {self.quantity} {self.ingredient.unit}"


class MealPlan(models.Model):
    MEAL_TYPES = [
        ('breakfast', 'Завтрак'),
        ('lunch', 'Обед'),
        ('dinner', 'Ужин'),
        ('snack', 'Перекус'),
    ]

    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    date = models.DateField(verbose_name="Дата")
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES, verbose_name="Приём пищи")
    portions = models.IntegerField(default=1, verbose_name="Количество порций")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "План питания"
        verbose_name_plural = "Планы питания"
        ordering = ['date', 'meal_type']

    def __str__(self):
        return f"{self.date} - {self.get_meal_type_display()}: {self.recipe.name}"


class ShoppingList(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Требуемое количество")
    purchased = models.BooleanField(default=False, verbose_name="Куплено")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Список покупок"
        verbose_name_plural = "Списки покупок"
        ordering = ['purchased', 'ingredient__name']

    def __str__(self):
        return f"{self.ingredient.name}: {self.quantity} {self.ingredient.unit}"
