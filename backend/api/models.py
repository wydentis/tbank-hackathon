from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.validators import MinValueValidator
from django.conf import settings

# Create your models here.
class CustomUser(AbstractUser):
  GENDER_CHOICES = [
    ("M", "Мужской"),
    ("F", "Женский"),
    ("O", "Другое"),
  ]
  age = models.PositiveIntegerField(null=True, blank=True)
  gender = models.CharField("пол", max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
  height = models.FloatField(null=True, blank=True)
  weight = models.FloatField(null=True, blank=True)
  tags = models.JSONField("теги", default=list, blank=True,
                           help_text="Список строк-тегов, например: ['Я ЖИРНЫЙ', 'ХОЧУ ПОХУДЕТЬ']")
  prefered_weight = models.FloatField(null=True, blank=True)
  email = models.EmailField(null=True, blank=True)

  class Meta:
    verbose_name = "пользователь"
    verbose_name_plural = "пользователи"

  def __str__(self):
    return self.username

class Product(models.Model):
  name = models.CharField("название", max_length=200, unique=True)
  image = models.ImageField("картинка", upload_to="products/", null=True, blank=True)

  # КБЖУ: калории, белки, жиры, углеводы
  kcal = models.PositiveIntegerField("ккал", null=True, blank=True)
  protein_g = models.DecimalField("белки (г)", max_digits=6, decimal_places=2, null=True, blank=True)
  fat_g = models.DecimalField("жиры (г)", max_digits=6, decimal_places=2, null=True, blank=True)
  carbs_g = models.DecimalField("углеводы (г)", max_digits=6, decimal_places=2, null=True, blank=True)

  class Meta:
    verbose_name = "продукт"
    verbose_name_plural = "продукты"

  def __str__(self):
    return self.name

class Fridge(models.Model):
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
  # cached total weight в граммах (опционально). Можно не использовать и вычислять на лету.
  total_weight_g = models.PositiveIntegerField("суммарный вес (г)", default=0)

  @property
  def total_weight_g(self):
    return sum(item.total_weight_g for item in self.items.all())

  def total_weight_by_product(self):
    result = {}
    for item in self.items.select_related("product").all():
      pid = item.product.name
      result.setdefault(pid, 0)
      result[pid] += item.weight_per_unit_g
    return result
      
  class Meta:
    verbose_name = "холодильник"
    verbose_name_plural = "холодильники"

  def __str__(self):
    return f"Fridge of {self.user.email}"

class FridgeItem(models.Model):
  def calc_weight():
    total = product.protein_g + product.fat_g + product.carbs_g 
    return total
    
  fridge = models.ForeignKey(Fridge, related_name="items", on_delete=models.CASCADE)
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  units = models.PositiveIntegerField("количество единиц", default=1, validators=[MinValueValidator(1)])
  weight_per_unit_g = models.PositiveIntegerField("вес на единицу (г)", null=True, blank=True,
                                                  help_text="Если не указано, подразумевается неизвестный вес; лучше указывать.",default=calc_weight)
  added_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    verbose_name = "элемент холодильника"
    verbose_name_plural = "элементы холодильника"

  def __str__(self):
    return f"{self.product.name} x{self.units} in {self.fridge.user.email}"
