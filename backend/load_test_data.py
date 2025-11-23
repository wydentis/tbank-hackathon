"""
Скрипт для загрузки тестовых данных
Запуск: python manage.py shell < load_test_data.py
"""

from recipes.models import Ingredient, Recipe, RecipeIngredient, Inventory

# Создаем ингредиенты
ingredients_data = [
    ('Молоко', 'л'),
    ('Яйца', 'шт'),
    ('Мука', 'кг'),
    ('Сахар', 'кг'),
    ('Соль', 'г'),
    ('Масло растительное', 'мл'),
    ('Масло сливочное', 'г'),
    ('Курица', 'кг'),
    ('Картофель', 'кг'),
    ('Лук', 'шт'),
    ('Морковь', 'шт'),
    ('Помидоры', 'кг'),
    ('Рис', 'кг'),
    ('Макароны', 'кг'),
    ('Сыр', 'г'),
]

print("Создание ингредиентов...")
for name, unit in ingredients_data:
    ing, created = Ingredient.objects.get_or_create(name=name, defaults={'unit': unit})
    if created:
        print(f"  ✓ {name}")

# Создаем рецепты
print("\nСоздание рецептов...")

# Рецепт 1: Омлет
recipe1, created = Recipe.objects.get_or_create(
    name="Омлет классический",
    defaults={
        'description': 'Простой и вкусный завтрак',
        'cooking_steps': '''1. Разбить яйца в миску
2. Добавить молоко, соль
3. Взбить венчиком
4. Разогреть сковороду с маслом
5. Вылить смесь на сковороду
6. Жарить 3-4 минуты до готовности'''
    }
)
if created:
    print("  ✓ Омлет")
    RecipeIngredient.objects.create(recipe=recipe1, ingredient=Ingredient.objects.get(name='Яйца'), amount=3)
    RecipeIngredient.objects.create(recipe=recipe1, ingredient=Ingredient.objects.get(name='Молоко'), amount=0.05)
    RecipeIngredient.objects.create(recipe=recipe1, ingredient=Ingredient.objects.get(name='Соль'), amount=5)
    RecipeIngredient.objects.create(recipe=recipe1, ingredient=Ingredient.objects.get(name='Масло растительное'), amount=20)

# Рецепт 2: Блины
recipe2, created = Recipe.objects.get_or_create(
    name="Блины",
    defaults={
        'description': 'Тонкие блины на молоке',
        'cooking_steps': '''1. Смешать яйца с сахаром и солью
2. Добавить молоко и перемешать
3. Постепенно всыпать муку, размешивая
4. Добавить масло в тесто
5. Разогреть сковороду
6. Жарить блины с двух сторон'''
    }
)
if created:
    print("  ✓ Блины")
    RecipeIngredient.objects.create(recipe=recipe2, ingredient=Ingredient.objects.get(name='Молоко'), amount=0.5)
    RecipeIngredient.objects.create(recipe=recipe2, ingredient=Ingredient.objects.get(name='Яйца'), amount=2)
    RecipeIngredient.objects.create(recipe=recipe2, ingredient=Ingredient.objects.get(name='Мука'), amount=0.25)
    RecipeIngredient.objects.create(recipe=recipe2, ingredient=Ingredient.objects.get(name='Сахар'), amount=0.03)
    RecipeIngredient.objects.create(recipe=recipe2, ingredient=Ingredient.objects.get(name='Соль'), amount=5)
    RecipeIngredient.objects.create(recipe=recipe2, ingredient=Ingredient.objects.get(name='Масло растительное'), amount=50)

# Рецепт 3: Куриный суп
recipe3, created = Recipe.objects.get_or_create(
    name="Куриный суп с лапшой",
    defaults={
        'description': 'Ароматный домашний суп',
        'cooking_steps': '''1. Отварить курицу до готовности
2. Вынуть курицу, бульон процедить
3. Нарезать лук, морковь
4. Обжарить овощи
5. Добавить в бульон
6. Добавить макароны
7. Варить 10 минут
8. Добавить мясо курицы'''
    }
)
if created:
    print("  ✓ Куриный суп")
    RecipeIngredient.objects.create(recipe=recipe3, ingredient=Ingredient.objects.get(name='Курица'), amount=0.5)
    RecipeIngredient.objects.create(recipe=recipe3, ingredient=Ingredient.objects.get(name='Лук'), amount=1)
    RecipeIngredient.objects.create(recipe=recipe3, ingredient=Ingredient.objects.get(name='Морковь'), amount=1)
    RecipeIngredient.objects.create(recipe=recipe3, ingredient=Ingredient.objects.get(name='Макароны'), amount=0.1)
    RecipeIngredient.objects.create(recipe=recipe3, ingredient=Ingredient.objects.get(name='Соль'), amount=10)

# Создаем запасы
print("\nСоздание запасов...")
inventory_data = [
    ('Молоко', 1.5),
    ('Яйца', 10),
    ('Мука', 2),
    ('Сахар', 1),
    ('Соль', 500),
    ('Масло растительное', 500),
]

for name, quantity in inventory_data:
    ing = Ingredient.objects.get(name=name)
    inv, created = Inventory.objects.get_or_create(
        ingredient=ing,
        defaults={'quantity': quantity}
    )
    if created:
        print(f"  ✓ {name}: {quantity} {ing.unit}")

print("\n✅ Тестовые данные загружены успешно!")
print("\nТеперь вы можете:")
print("1. Просмотреть рецепты на главной странице")
print("2. Добавить блюда в план питания")
print("3. Сгенерировать список покупок")
print("4. Посмотреть подбор рецептов")
